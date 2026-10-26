import type { Tables } from './schema'

type DataError = { message: string; code?: string }
type Result<T> = { data: T; error: DataError | null; count: number | null }
type Operation = 'select' | 'insert' | 'update' | 'delete' | 'upsert'
const publicTables = new Set(['businesses', 'services', 'working_hours'])
const jsonFields = new Set([
  'social_links',
  'images',
  'place_data',
  'content',
  'metadata',
  'details',
  'cloudflare_ownership_verification',
  'cloudflare_ssl_validation_records',
  'cloudflare_verification_errors',
])
const booleanFields = new Set([
  'is_closed',
  'is_visible',
  'onboarding_completed',
])
const identifier = (value: string) => {
  if (!/^[a-z_][a-z_0-9]*$/i.test(value))
    throw new Error('Invalid SQL identifier')
  return `"${value}"`
}
const encode = (value: unknown): string | number | null =>
  value == null
    ? null
    : typeof value === 'boolean'
      ? Number(value)
      : typeof value === 'object'
        ? JSON.stringify(value)
        : typeof value === 'number'
          ? value
          : String(value)
function decode<T>(row: Record<string, unknown>): T {
  for (const [key, value] of Object.entries(row)) {
    if (jsonFields.has(key) && typeof value === 'string')
      row[key] = JSON.parse(value)
    if (booleanFields.has(key) && value != null) row[key] = Boolean(value)
  }
  return row as T
}

/** Request-local D1 queries. Tenant predicates apply to every read and mutation. */
export class Query<K extends keyof Tables> implements PromiseLike<
  Result<Tables[K][]>
> {
  private operation: Operation = 'select'
  private columns = '*'
  private filters: string[] = []
  private values: unknown[] = []
  private rows: Record<string, unknown>[] = []
  private sorting: string[] = []
  private take?: number
  private conflict = 'id'
  private countOnly = false
  constructor(
    private database: D1Database,
    private table: K,
    private userId: string | null,
    private admin = false
  ) {}
  select(columns = '*', options?: { count?: string; head?: boolean }) {
    this.columns = columns
    this.countOnly = options?.head === true
    return this
  }
  eq(column: string, value: unknown) {
    return this.filter(column, value == null ? 'IS' : '=', value)
  }
  neq(column: string, value: unknown) {
    return this.filter(column, value == null ? 'IS NOT' : '!=', value)
  }
  gte(column: string, value: unknown) {
    return this.filter(column, '>=', value)
  }
  lt(column: string, value: unknown) {
    return this.filter(column, '<', value)
  }
  in(column: string, values: unknown[]) {
    this.filters.push(
      values.length
        ? `${identifier(column)} IN (${values.map(() => '?').join(',')})`
        : '0'
    )
    this.values.push(...values)
    return this
  }
  private filter(column: string, op: string, value: unknown) {
    this.filters.push(`${identifier(column)} ${op} ?`)
    this.values.push(value)
    return this
  }
  order(column: string, options?: { ascending?: boolean }) {
    this.sorting.push(
      `${identifier(column)} ${options?.ascending === false ? 'DESC' : 'ASC'}`
    )
    return this
  }
  limit(value: number) {
    if (!Number.isSafeInteger(value) || value < 0)
      throw new Error('Invalid limit')
    this.take = value
    return this
  }
  insert(rows: Record<string, unknown> | Record<string, unknown>[]) {
    this.operation = 'insert'
    this.rows = Array.isArray(rows) ? rows : [rows]
    return this
  }
  upsert(
    rows: Record<string, unknown> | Record<string, unknown>[],
    options?: { onConflict?: string }
  ) {
    this.insert(rows)
    this.operation = 'upsert'
    this.conflict = options?.onConflict ?? 'id'
    return this
  }
  update(row: Record<string, unknown>) {
    this.operation = 'update'
    this.rows = [row]
    return this
  }
  delete() {
    this.operation = 'delete'
    return this
  }

  private access(write: boolean): { sql: string; bindings: unknown[] } {
    if (this.admin) return { sql: '1', bindings: [] }
    const table = identifier(this.table)
    const owned = (business: string) =>
      `EXISTS (SELECT 1 FROM businesses b WHERE b.id = ${business} AND b.user_id = ?)`
    const member = (business: string, writers = false) =>
      `EXISTS (SELECT 1 FROM team_members m WHERE m.business_id = ${business} AND m.user_id = ? AND m.status = 'active'${writers ? " AND m.role IN ('admin','editor')" : ''})`
    const business = `${table}.business_id`
    if (!write && publicTables.has(this.table))
      return { sql: '1', bindings: [] }
    if (!write && this.table === 'business_domains') {
      return this.userId
        ? {
            sql: `(status = 'active' OR ${owned(business)} OR ${member(business)})`,
            bindings: [this.userId, this.userId],
          }
        : { sql: "status = 'active'", bindings: [] }
    }
    if (!this.userId) return { sql: '0', bindings: [] }
    if (write && this.table === 'subscriptions')
      return { sql: '0', bindings: [] }
    if (this.table === 'profiles')
      return { sql: `${table}.id = ?`, bindings: [this.userId] }
    if (
      this.table === 'businesses' ||
      this.table === 'business_generation_usage' ||
      this.table === 'subscriptions'
    )
      return { sql: `${table}.user_id = ?`, bindings: [this.userId] }
    if (write && this.table !== 'calendar_events')
      return { sql: owned(business), bindings: [this.userId] }
    if (this.table === 'leads')
      return { sql: owned(business), bindings: [this.userId] }
    return {
      sql: `(${owned(business)} OR ${member(business, write)})`,
      bindings: [this.userId, this.userId],
    }
  }

  private async authorizeRows() {
    if (this.admin) return
    for (const row of this.rows) {
      if (this.table === 'leads' && this.operation === 'insert') continue
      if (!this.userId) throw new Error('Authentication required')
      if (this.table === 'profiles') {
        if (row.id !== this.userId) throw new Error('Forbidden profile')
        if (
          Object.keys(row).some(
            (key) => key.startsWith('stripe_') || key === 'trial_ends_at'
          )
        )
          throw new Error('Billing fields are read-only')
      } else if (
        this.table === 'businesses' ||
        this.table === 'business_generation_usage'
      ) {
        if (row.user_id !== this.userId) throw new Error('Forbidden owner')
      } else if (this.table === 'subscriptions')
        throw new Error('Billing fields are read-only')
      if (row.business_id) {
        const business = await this.database
          .prepare('SELECT user_id FROM businesses WHERE id = ?')
          .bind(row.business_id)
          .first<{ user_id: string }>()
        if (business?.user_id !== this.userId) {
          const membership =
            this.table === 'calendar_events' &&
            (await this.database
              .prepare(
                "SELECT id FROM team_members WHERE business_id = ? AND user_id = ? AND status = 'active' AND role IN ('admin','editor')"
              )
              .bind(row.business_id, this.userId)
              .first())
          if (!membership) throw new Error('Forbidden business')
        }
      }
    }
  }

  private async execute(): Promise<Result<Tables[K][]>> {
    try {
      const table = identifier(this.table)
      const write = this.operation !== 'select'
      if (write && this.operation !== 'delete') {
        // Prevent ownership changes, billing writes and cross-tenant upsert conflicts.
        if (this.operation === 'update') {
          const forbidden = [
            'id',
            'user_id',
            'business_id',
            'created_by',
            'created_at',
          ]
          if (
            !this.admin &&
            Object.keys(this.rows[0]).some(
              (key) =>
                forbidden.includes(key) ||
                (this.table === 'profiles' &&
                  (key.startsWith('stripe_') || key === 'trial_ends_at'))
            )
          )
            throw new Error('Protected field')
        } else await this.authorizeRows()
      }
      if (this.operation === 'insert' || this.operation === 'upsert') {
        if (!this.rows.length) return { data: [], error: null, count: 0 }
        const statements = []
        const conflictKeys = this.conflict.split(',').map((key) => key.trim())
        for (const row of this.rows) {
          if (this.operation === 'upsert' && !this.admin) {
            const existing = await this.database
              .prepare(
                `SELECT * FROM ${table} WHERE ${conflictKeys.map((key) => `${identifier(key)} = ?`).join(' AND ')}`
              )
              .bind(...conflictKeys.map((key) => encode(row[key])))
              .first<Record<string, unknown>>()
            if (existing) {
              const scope = this.access(true)
              const permitted = await this.database
                .prepare(`SELECT 1 FROM ${table} WHERE id = ? AND ${scope.sql}`)
                .bind(existing.id, ...scope.bindings.map(encode))
                .first()
              if (!permitted) throw new Error('Forbidden upsert')
              for (const key of ['id', 'user_id', 'business_id'])
                if (row[key] !== undefined && row[key] !== existing[key])
                  throw new Error('Protected field')
            }
          }
          const data = { id: crypto.randomUUID(), ...row }
          const keys = Object.keys(data)
          const updates = keys.filter(
            (key) => !conflictKeys.includes(key) && key !== 'id'
          )
          const conflict =
            this.operation === 'upsert'
              ? ` ON CONFLICT (${conflictKeys.map(identifier).join(',')}) DO ${updates.length ? `UPDATE SET ${updates.map((key) => `${identifier(key)} = excluded.${identifier(key)}`).join(',')}` : 'NOTHING'}`
              : ''
          statements.push(
            this.database
              .prepare(
                `INSERT INTO ${table} (${keys.map(identifier).join(',')}) VALUES (${keys.map(() => '?').join(',')})${conflict} RETURNING *`
              )
              .bind(
                ...keys.map((key) => encode(data[key as keyof typeof data]))
              )
          )
        }
        const results =
          await this.database.batch<Record<string, unknown>>(statements)
        return {
          data: results.flatMap((result) =>
            result.results.map((row) => decode<Tables[K]>(row))
          ),
          error: null,
          count: null,
        }
      }
      const scope = this.access(write)
      const where = [scope.sql, ...this.filters]
        .map((part) => `(${part})`)
        .join(' AND ')
      const bindings = [...scope.bindings, ...this.values].map(encode)
      let sql: string
      if (this.operation === 'update') {
        const keys = Object.keys(this.rows[0])
        sql = `UPDATE ${table} SET ${keys.map((key) => `${identifier(key)} = ?`).join(',')} WHERE ${where} RETURNING *`
        bindings.unshift(...keys.map((key) => encode(this.rows[0][key])))
      } else if (this.operation === 'delete')
        sql = `DELETE FROM ${table} WHERE ${where} RETURNING *`
      else {
        // Relations are loaded below; all identifiers are validated before interpolation.
        const projection = this.columns.includes('(')
          ? '*'
          : this.columns
              .split(',')
              .map((key) => (key.trim() === '*' ? '*' : identifier(key.trim())))
              .join(',')
        sql = `SELECT ${this.countOnly ? 'COUNT(*) AS total' : projection} FROM ${table} WHERE ${where}`
        if (this.sorting.length && !this.countOnly)
          sql += ` ORDER BY ${this.sorting.join(',')}`
        if (this.take !== undefined && !this.countOnly)
          sql += ` LIMIT ${this.take}`
      }
      const result = await this.database
        .prepare(sql)
        .bind(...bindings)
        .all<Record<string, unknown>>()
      if (this.countOnly)
        return {
          data: [],
          error: null,
          count: Number(result.results[0]?.total ?? 0),
        }
      const rows = result.results.map((row) => decode<Tables[K]>(row))
      if (this.columns.includes('profiles:user_id')) {
        for (const row of rows)
          Object.assign(row, {
            profiles: await this.database
              .prepare(
                'SELECT full_name, avatar_url FROM profiles WHERE id = ?'
              )
              .bind((row as Tables['team_members']).user_id)
              .first(),
          })
      }
      if (this.columns.includes('businesses!inner')) {
        const requested =
          this.columns.match(/businesses!inner\s*\(([^)]+)\)/)?.[1] ?? '*'
        const projection = requested
          .split(',')
          .map((column) =>
            column.trim() === '*' ? '*' : identifier(column.trim())
          )
          .join(',')
        for (const row of rows)
          Object.assign(row, {
            businesses: await this.database
              .prepare(`SELECT ${projection} FROM businesses WHERE id = ?`)
              .bind((row as Tables['team_members']).business_id)
              .first(),
          })
      }
      return { data: rows, error: null, count: null }
    } catch (error) {
      return {
        data: [],
        error: {
          message: error instanceof Error ? error.message : 'D1 query failed',
        },
        count: null,
      }
    }
  }
  async maybeSingle(): Promise<Result<Tables[K] | null>> {
    const result = await this.execute()
    return result.data.length > 1
      ? {
          data: null,
          error: { message: 'Expected at most one row' },
          count: null,
        }
      : { ...result, data: result.data[0] ?? null }
  }
  async single(): Promise<Result<Tables[K]>> {
    const result = await this.maybeSingle()
    return {
      ...result,
      data: result.data as Tables[K],
      error:
        result.error ?? (result.data ? null : { message: 'Expected one row' }),
    }
  }
  then<TResult1 = Result<Tables[K][]>, TResult2 = never>(
    onfulfilled?:
      | ((value: Result<Tables[K][]>) => TResult1 | PromiseLike<TResult1>)
      | null,
    onrejected?: ((reason: unknown) => TResult2 | PromiseLike<TResult2>) | null
  ): PromiseLike<TResult1 | TResult2> {
    return this.execute().then(onfulfilled, onrejected)
  }
}
