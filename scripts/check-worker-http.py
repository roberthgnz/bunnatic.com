"""Exercise NextAuth and D1 through a local Cloudflare Vite server, without a second workerd."""
import hashlib, http.client, json, secrets, sys, urllib.parse
from http.cookies import SimpleCookie

base=urllib.parse.urlsplit(sys.argv[1] if len(sys.argv)>1 else 'http://127.0.0.1:3000')
assert base.hostname in ['localhost','127.0.0.1'], 'Local Worker only'
cookies={}
def request(path,body=None,content_type='application/json',method=None):
    connection=http.client.HTTPConnection(base.hostname,base.port or 80,timeout=60)
    payload=json.dumps(body) if isinstance(body,(dict,list)) else body
    headers={'Cookie':'; '.join(f'{key}={value}' for key,value in cookies.items())}
    if payload is not None:headers['Content-Type']=content_type
    connection.request(method or ('POST' if body is not None else 'GET'),path,payload,headers)
    response=connection.getresponse()
    for name,value in response.getheaders():
        if name.lower()=='set-cookie':
            cookie=SimpleCookie();cookie.load(value)
            for key,morsel in cookie.items():cookies[key]=morsel.value
    status=response.status
    location=response.getheader('Location','')
    text=response.read().decode('utf-8')
    connection.close()
    try:data=json.loads(text)
    except json.JSONDecodeError:data=text[:200]
    return status,location,data
def sql(statement,params):
    status,_,data=request('/cdn-cgi/local/explorer/api/d1/database/DB/raw',{'sql':statement,'params':[str(value) if value is not None else None for value in params]})
    assert status==200 and data.get('success'), ('Local D1 query failed',status,data)
    return data

prefix='http-test-'+secrets.token_hex(8)
owner=prefix+'-owner'
other=prefix+'-other'
business=prefix+'-business'
password='Locavo-Test-123!'
salt=secrets.token_bytes(16)
encoded='pbkdf2$100000$'+salt.hex()+'$'+hashlib.pbkdf2_hmac('sha256',password.encode(),salt,100000).hex()
try:
    for user in [owner,other]:sql('INSERT INTO users(id,email,name,password_hash,emailVerified) VALUES(?,?,?,?,?)',[user,user+'@example.invalid',user,encoded,'2026-10-26T00:00:00.000Z'])
    sql('INSERT INTO businesses(id,user_id,name,slug) VALUES(?,?,?,?)',[business,owner,'Local test',prefix])
    status,_,_=request('/api/profile')
    assert status==401, ('Guest profile response',status)
    assert request('/dashboard')[0]==307
    _,_,csrf=request('/api/auth/csrf')
    status,_,signed_in=request('/api/auth/callback/credentials',urllib.parse.urlencode({'email':owner+'@example.invalid','password':password,'csrfToken':csrf['csrfToken'],'callbackUrl':'http://localhost:3000/dashboard','json':'true'}),'application/x-www-form-urlencoded')
    if isinstance(signed_in,dict):assert 'error=' not in signed_in.get('url',''), ('Login failed',signed_in)
    status,_,profile=request('/api/profile')
    assert status==200 and profile['email']==owner+'@example.invalid', ('Authenticated profile response',status)
    status,_,session=request('/api/auth/session')
    assert status==200 and session['user']['id']==owner
    status,_,businesses=request('/api/businesses')
    assert status==200 and any(row['id']==business for row in businesses)
    token=secrets.token_urlsafe(32)
    import time
    sql("INSERT INTO auth_tokens(token_hash,user_id,purpose,expires_at) VALUES(?,?,'verify',?)",[hashlib.sha256(token.encode()).hexdigest(),other,int(time.time()*1000)+60000])
    status,location,_=request('/auth/confirm?token='+token+'&next='+urllib.parse.quote('/onboarding?step=checkout&plan=pro'))
    assert status==307 and 'verified=1' in location
    assert 'auth_confirmation_failed' in request('/auth/confirm?token='+token)[1]
    assert request('/api/generation-state',{'sourceType':'google','googleQuery':'Local test'})[0]==200
    assert request('/api/generation-state',method='DELETE')[0]==200
    sql('UPDATE users SET session_version=session_version+1 WHERE id=?',[owner])
    assert request('/api/profile')[0]==401
    print('Worker HTTP: guest protection, credentials login, NextAuth session, profile/business reads, single-use confirmation, KV write and session revocation passed.')
finally:
    sql('DELETE FROM businesses WHERE id=?',[business])
    for user in [owner,other]:sql('DELETE FROM users WHERE id=?',[user])
