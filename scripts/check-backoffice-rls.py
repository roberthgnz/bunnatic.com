"""Verify the migration in a fresh local PostgreSQL cluster; never connects to Supabase."""
import argparse
import os
from pathlib import Path
import shutil
import socket
import subprocess
import tempfile

parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument('--pg-bin', default=r'C:\Program Files\PostgreSQL\18\bin' if os.name == 'nt' else '')
args = parser.parse_args()
suffix = '.exe' if os.name == 'nt' else ''

def binary(name):
    path = Path(args.pg_bin) / (name + suffix) if args.pg_bin else Path(shutil.which(name) or '')
    if not path.is_file():
        raise SystemExit(f'PostgreSQL binary not found: {name}. Supply --pg-bin for your local installation.')
    return str(path)

pg_init, pg_ctl, psql = [binary(name) for name in ('initdb', 'pg_ctl', 'psql')]
project = Path(__file__).resolve().parent.parent
root = Path(tempfile.mkdtemp(prefix='novaweb-rls-')).resolve()
assert root.parent == Path(tempfile.gettempdir()).resolve() and root.name.startswith('novaweb-rls-')
data = root / 'data'
started = False

def run(command, **kwargs):
    # On Windows pg_ctl's detached server inherits pipe handles. A regular
    # temporary file avoids waiting for the live server to close stdout.
    with tempfile.TemporaryFile(mode='w+', encoding='utf-8', errors='replace') as output:
        result = subprocess.run(command, stdout=output, stderr=subprocess.STDOUT, timeout=60, **kwargs)
        output.seek(0)
        text = output.read()
    if result.returncode:
        raise RuntimeError(text)
    return text

try:
    run([pg_init, '-D', str(data), '-A', 'trust', '-U', 'postgres', '--no-locale', '-E', 'UTF8'])
    with socket.socket() as listener:
        listener.bind(('127.0.0.1', 0))
        port = listener.getsockname()[1]
    run([pg_ctl, '-D', str(data), '-l', str(root / 'postgres.log'), '-o', f'-h 127.0.0.1 -p {port}', '-w', '-t', '30', 'start'])
    started = True
    connection = [psql, '-h', '127.0.0.1', '-p', str(port), '-U', 'postgres', '-d', 'postgres', '-v', 'ON_ERROR_STOP=1']
    setup = """
create role anon;
create role authenticated;
create schema auth;
create table auth.users (id uuid primary key);
create function auth.uid() returns uuid language sql stable as $$ select nullif(current_setting('request.jwt.claim.sub', true), '')::uuid $$;
"""
    migrations = project / 'supabase' / 'migrations'
    for name in ['20240311_create_businesses.sql', '20240311_create_backoffice_tables.sql', '20240311_create_sections_table.sql', '20240311_create_team_tables.sql', '20240311_create_advanced_features.sql', '20261026_harden_backoffice_permissions.sql']:
        setup += '\n' + (migrations / name).read_text(encoding='utf-8')
    setup += '\ngrant usage on schema public, auth to anon, authenticated;\ngrant select, insert, update, delete on all tables in schema public to anon, authenticated;\n'
    setup_path = root / 'setup.sql'
    setup_path.write_text(setup, encoding='utf-8')
    run(connection + ['-q', '-f', str(setup_path)])
    output = run(connection + ['-q', '-f', str(project / 'scripts' / 'backoffice-rls-check.sql')])
    print(output.strip())
finally:
    if started or (data / 'postmaster.pid').exists():
        run([pg_ctl, '-D', str(data), '-m', 'immediate', '-w', 'stop'])
    # The disposable absolute target was verified before starting the cluster.
    assert root.parent == Path(tempfile.gettempdir()).resolve() and root.name.startswith('novaweb-rls-')
    shutil.rmtree(root)
