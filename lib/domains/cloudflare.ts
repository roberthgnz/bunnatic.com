import { getCloudflareCustomOriginServer, getCloudflareSslMethod } from '@/lib/domains/config'

const CLOUDFLARE_API_BASE = 'https://api.cloudflare.com/client/v4'

export type DomainConnectionStatus = 'pending_dns' | 'pending_ssl' | 'active' | 'moved' | 'error'

type CloudflareError = {
  code?: number
  message?: string
}

type CloudflareResponse<T> = {
  success: boolean
  errors?: CloudflareError[]
  messages?: Array<{ code?: number; message?: string }>
  result?: T
}

export type CloudflareCustomHostname = {
  id: string
  hostname: string
  status?: string
  verification_errors?: Array<{ message?: string }> | null
  ownership_verification?: {
    type?: string
    name?: string
    value?: string
    http_url?: string
    http_body?: string
  } | null
  ssl?: {
    status?: string
    method?: string
  } | null
}

type CloudflareConfig = {
  token: string
  zoneId: string
}

function getCloudflareConfig(): CloudflareConfig {
  const token = process.env.CLOUDFLARE_API_TOKEN?.trim()
  const zoneId = process.env.CLOUDFLARE_ZONE_ID?.trim()

  if (!token || !zoneId) {
    throw new Error('Cloudflare no está configurado. Define CLOUDFLARE_API_TOKEN y CLOUDFLARE_ZONE_ID.')
  }

  return { token, zoneId }
}

function buildCloudflareError(prefix: string, payload: CloudflareResponse<unknown>) {
  const details = (payload.errors || [])
    .map((error) => `${error.code ?? 'unknown'}: ${error.message ?? 'error no especificado'}`)
    .join(' | ')

  return details ? `${prefix} (${details})` : prefix
}

async function cloudflareRequest<T>(
  path: string,
  init: RequestInit = {}
): Promise<T> {
  const config = getCloudflareConfig()

  const response = await fetch(`${CLOUDFLARE_API_BASE}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${config.token}`,
      ...(init.headers || {}),
    },
    cache: 'no-store',
  })

  const payload = (await response.json()) as CloudflareResponse<T>

  if (!response.ok || !payload.success || !payload.result) {
    const message = buildCloudflareError('Cloudflare API error', payload)
    throw new Error(message)
  }

  return payload.result
}

export function mapCloudflareStatus(record: CloudflareCustomHostname): DomainConnectionStatus {
  const customHostnameStatus = record.status?.toLowerCase()
  const sslStatus = record.ssl?.status?.toLowerCase()
  const hasVerificationErrors = (record.verification_errors?.length || 0) > 0

  if (customHostnameStatus === 'moved' || customHostnameStatus === 'deleted') {
    return 'moved'
  }

  if (sslStatus === 'active') {
    return 'active'
  }

  if (hasVerificationErrors) {
    return 'error'
  }

  if (
    sslStatus === 'pending_validation' ||
    sslStatus === 'validation_timed_out' ||
    sslStatus === 'initializing'
  ) {
    return 'pending_dns'
  }

  return 'pending_ssl'
}

export function extractOwnershipVerificationRecord(record: CloudflareCustomHostname) {
  const verification = record.ownership_verification
  if (!verification) {
    return { name: null, value: null }
  }

  return {
    name: verification.name ?? null,
    value: verification.value ?? null,
  }
}

export async function createCloudflareCustomHostname(hostname: string) {
  const { zoneId } = getCloudflareConfig()

  const body: Record<string, unknown> = {
    hostname,
    ssl: {
      method: getCloudflareSslMethod(),
      type: 'dv',
    },
  }

  const customOriginServer = getCloudflareCustomOriginServer()
  if (customOriginServer) {
    body.custom_origin_server = customOriginServer
  }

  return cloudflareRequest<CloudflareCustomHostname>(`/zones/${zoneId}/custom_hostnames`, {
    method: 'POST',
    body: JSON.stringify(body),
  })
}

export async function getCloudflareCustomHostname(id: string) {
  const { zoneId } = getCloudflareConfig()

  return cloudflareRequest<CloudflareCustomHostname>(
    `/zones/${zoneId}/custom_hostnames/${id}`,
    {
      method: 'GET',
    }
  )
}

export async function findCloudflareCustomHostnameByHostname(hostname: string) {
  const { zoneId } = getCloudflareConfig()
  const encoded = encodeURIComponent(hostname)

  const list = await cloudflareRequest<CloudflareCustomHostname[]>(
    `/zones/${zoneId}/custom_hostnames?hostname=${encoded}`,
    {
      method: 'GET',
    }
  )

  return list.find((entry) => entry.hostname?.toLowerCase() === hostname.toLowerCase()) ?? null
}

export async function deleteCloudflareCustomHostname(id: string) {
  const { zoneId } = getCloudflareConfig()

  await cloudflareRequest<{ id: string }>(`/zones/${zoneId}/custom_hostnames/${id}`, {
    method: 'DELETE',
  })
}
