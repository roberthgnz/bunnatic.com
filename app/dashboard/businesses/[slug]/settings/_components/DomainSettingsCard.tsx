'use client'

import { useMemo, useState, useTransition, type ReactNode } from 'react'
import {
  AlertTriangle,
  ArrowUpRight,
  Check,
  CheckCircle2,
  Clock,
  Copy,
  Globe,
  Info,
  Loader2,
  RefreshCcw,
  Trash2,
} from 'lucide-react'
import { toast } from 'sonner'
import {
  connectBusinessDomain,
  disconnectBusinessDomain,
  refreshBusinessDomainStatus,
} from '@/lib/supabase/actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

type DomainStatus = 'pending_dns' | 'pending_ssl' | 'active' | 'moved' | 'error'

type DomainRecord = {
  id: string
  hostname: string
  status: DomainStatus
  verification_method: 'txt' | 'http'
  verification_record_name: string | null
  verification_record_value: string | null
  cloudflare_ssl_status: string | null
  cloudflare_ssl_validation_records?: Array<{
    txt_name?: string
    txt_value?: string
    http_url?: string
    http_body?: string
    cname?: string
  }> | null
  cloudflare_verification_errors?: Array<
    { message?: string; error?: string } | string
  > | null
  activated_at: string | null
  last_checked_at: string | null
}

function formatDateTime(value: string | null) {
  if (!value) return '—'

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) {
    return '—'
  }

  const formatter = new Intl.DateTimeFormat('es-ES', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
    timeZone: 'Europe/Madrid',
  })

  return formatter.format(date)
}

type BadgeVariant = 'success' | 'warning' | 'destructive' | 'outline'

function getStatusMeta(status: DomainStatus): {
  label: string
  variant: BadgeVariant
  description: string
} {
  const meta: Record<
    DomainStatus,
    { label: string; variant: BadgeVariant; description: string }
  > = {
    pending_dns: {
      label: 'Pendiente de DNS',
      variant: 'warning',
      description:
        'Estamos esperando a que los registros DNS estén configurados y se propaguen.',
    },
    pending_ssl: {
      label: 'Emitiendo SSL',
      variant: 'warning',
      description:
        'El dominio ya apunta a Bunnatic. Falta validar y emitir el certificado HTTPS.',
    },
    active: {
      label: 'Activo',
      variant: 'success',
      description: 'Tu web ya se sirve desde este dominio con HTTPS.',
    },
    moved: {
      label: 'Movido',
      variant: 'outline',
      description:
        'El dominio ha dejado de apuntar a Bunnatic. Revisa el registro CNAME.',
    },
    error: {
      label: 'Error',
      variant: 'destructive',
      description:
        'La verificación ha fallado. Revisa los registros y vuelve a comprobar el estado.',
    },
  }

  return meta[status]
}

/** Index of the current step in the connection timeline (0-based). */
function getProgressStep(status: DomainStatus) {
  switch (status) {
    case 'active':
      return 3
    case 'pending_ssl':
      return 2
    default:
      return 1
  }
}

function CopyButton({
  copied,
  label,
  onCopy,
}: {
  copied: boolean
  label: string
  onCopy: () => void
}) {
  return (
    <Button
      type="button"
      size="sm"
      variant="outline"
      onClick={onCopy}
      aria-label={copied ? 'Copiado' : `Copiar ${label}`}
      className={cn('w-full sm:w-24', copied && 'text-success')}
    >
      {copied ? <Check aria-hidden="true" /> : <Copy aria-hidden="true" />}
      {copied ? 'Copiado' : 'Copiar'}
    </Button>
  )
}

function DnsField({
  label,
  value,
  copied,
  onCopy,
}: {
  label: string
  value: string
  copied: boolean
  onCopy: () => void
}) {
  return (
    <div className="grid gap-1.5 sm:grid-cols-[72px_minmax(0,1fr)_auto] sm:items-center sm:gap-3">
      <dt className="text-muted-foreground text-xs font-medium">{label}</dt>
      <dd className="min-w-0">
        <code className="bg-muted text-foreground block rounded-md px-2 py-1.5 font-mono text-xs break-all">
          {value}
        </code>
      </dd>
      <dd>
        <CopyButton
          copied={copied}
          label={label.toLowerCase()}
          onCopy={onCopy}
        />
      </dd>
    </div>
  )
}

function DnsStep({
  number,
  title,
  description,
  recordType,
  children,
}: {
  number: number
  title: string
  description?: string
  recordType?: string
  children: ReactNode
}) {
  return (
    <li className="flex gap-4 px-5 py-5 sm:px-6">
      <span
        aria-hidden="true"
        className="bg-secondary text-secondary-foreground flex size-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold tabular-nums"
      >
        {number}
      </span>
      <div className="min-w-0 flex-1 space-y-3">
        <div className="space-y-0.5">
          <div className="flex flex-wrap items-center gap-2">
            <h4 className="text-foreground text-sm font-semibold">
              <span className="sr-only">Paso {number}: </span>
              {title}
            </h4>
            {recordType ? (
              <Badge variant="outline" className="font-mono">
                {recordType}
              </Badge>
            ) : null}
          </div>
          {description ? (
            <p className="text-muted-foreground text-xs leading-5">
              {description}
            </p>
          ) : null}
        </div>
        {children}
      </div>
    </li>
  )
}

export default function DomainSettingsCard({
  businessSlug,
  initialDomain,
  dnsTarget,
  rootDomain,
}: {
  businessSlug: string
  initialDomain: DomainRecord | null
  dnsTarget: string | null
  rootDomain: string | null
}) {
  const [domain, setDomain] = useState<DomainRecord | null>(initialDomain)
  const [hostname, setHostname] = useState(initialDomain?.hostname || '')
  const [copiedKey, setCopiedKey] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const t = {
    heading: 'Dominio personalizado',
    subheading:
      'Usa tu propio dominio (por ejemplo, www.tunegocio.com) para tu web. Te guiamos paso a paso con la configuración DNS.',
    requirement:
      'Necesitarás acceso al panel DNS de tu proveedor de dominio (GoDaddy, IONOS, Cloudflare…).',
    hostnameLabel: 'Dominio',
    hostnamePlaceholder: 'www.tunegocio.com',
    hostnameHint: 'Escribe el dominio sin https:// ni barras al final.',
    connect: 'Conectar dominio',
    replace: 'Reemplazar dominio',
    refreshing: 'Comprobando…',
    refresh: 'Comprobar estado',
    disconnect: 'Desconectar',
    noDomain:
      'Todavía no has conectado ningún dominio. Tu web sigue disponible en su dirección de Bunnatic.',
    progressLabel: 'Progreso de la conexión',
    progressSteps: [
      'Dominio añadido',
      'DNS verificado',
      'SSL emitido',
      'Activo',
    ],
    dnsTitle: 'Configura estos registros DNS',
    dnsSubtitle:
      'Entra en el panel DNS de tu proveedor y crea los siguientes registros copiando los valores exactamente.',
    cnameTitle: 'Apunta tu dominio a Bunnatic',
    cnameDesc:
      'Crea o edita un registro CNAME. Solo tendrás que hacerlo una vez.',
    ownershipTitle: 'Demuestra que el dominio es tuyo',
    ownershipDesc:
      'Añade este registro TXT para verificar la propiedad del dominio.',
    sslTitle: 'Valida el certificado SSL',
    sslDesc:
      'Necesario para servir tu web con HTTPS. Si hay varios registros TXT con el mismo host, créalos todos (uno por valor).',
    sslTxt: 'Registro TXT',
    sslHttp: 'Validación HTTP',
    noSslValidationRecords:
      'Cloudflare todavía no ha generado los registros SSL. Comprueba el estado de nuevo en unos minutos.',
    activeDnsInfo:
      'Todo listo. No necesitas crear más registros DNS salvo que cambies de proveedor.',
    host: 'Host',
    target: 'Destino',
    value: 'Valor',
    url: 'URL',
    body: 'Contenido',
    copyError: 'No se pudo copiar al portapapeles.',
    validationErrors: 'Errores de validación',
    noValidationErrorDetails:
      'Cloudflare ha marcado un error, pero no ha devuelto más detalles.',
    sslStatus: 'Estado SSL',
    lastCheck: 'Última comprobación',
    activatedAt: 'Activado el',
    visit: 'Visitar web',
    successConnect:
      'Dominio conectado. Configura los registros DNS y comprueba el estado.',
    successRefresh: 'Estado del dominio actualizado.',
    successDisconnect: 'Dominio desconectado correctamente.',
    propagationHint:
      'Los cambios de DNS pueden tardar desde unos minutos hasta unas horas en propagarse.',
  }

  const statusMeta = useMemo(() => {
    if (!domain) return null
    return getStatusMeta(domain.status)
  }, [domain])

  const canConnect = hostname.trim().length > 3
  const isReplacing = Boolean(
    domain && domain.hostname !== hostname.trim().toLowerCase()
  )
  const normalizedRootDomain = rootDomain?.trim().toLowerCase() || null
  const validationErrors = (domain?.cloudflare_verification_errors || [])
    .map((item) => {
      if (typeof item === 'string') return item
      return item?.message || item?.error || ''
    })
    .filter(Boolean)
  const sslValidationRecords = (
    domain?.cloudflare_ssl_validation_records || []
  ).filter(
    (
      item
    ): item is NonNullable<
      DomainRecord['cloudflare_ssl_validation_records']
    >[number] => Boolean(item)
  )
  const needsDnsSetup = domain?.status !== 'active'

  function formatDnsHost(host: string | null | undefined) {
    if (!host) {
      return '—'
    }

    const normalizedHost = host.trim().toLowerCase()
    if (normalizedRootDomain && normalizedHost === normalizedRootDomain) {
      return '@'
    }

    return host
  }

  function handleConnect() {
    if (!canConnect) {
      return
    }

    startTransition(async () => {
      const formData = new FormData()
      formData.set('hostname', hostname)
      formData.set('verification_method', 'txt')

      const result = await connectBusinessDomain(businessSlug, formData)
      if (result?.error) {
        toast.error(result.error)
        return
      }

      if (result?.domain) {
        setDomain(result.domain as DomainRecord)
        setHostname((result.domain as DomainRecord).hostname)
      }
      if (result?.warning) {
        toast.warning(result.warning)
      }
      toast.success(t.successConnect)
    })
  }

  function handleRefresh() {
    startTransition(async () => {
      const result = await refreshBusinessDomainStatus(businessSlug)
      if (result?.error) {
        toast.error(result.error)
        return
      }

      if (result?.domain) {
        setDomain(result.domain as DomainRecord)
      }
      toast.success(t.successRefresh)
    })
  }

  function handleDisconnect() {
    startTransition(async () => {
      const result = await disconnectBusinessDomain(businessSlug)
      if (result?.error) {
        toast.error(result.error)
        return
      }

      setDomain(null)
      setHostname('')
      toast.success(t.successDisconnect)
    })
  }

  async function copyValue(value: string, key: string) {
    try {
      await navigator.clipboard.writeText(value)
      setCopiedKey(key)
      window.setTimeout(() => {
        setCopiedKey((current) => (current === key ? null : current))
      }, 1500)
    } catch {
      toast.error(t.copyError)
    }
  }

  const hasOwnershipRecord = Boolean(
    domain?.verification_record_name && domain?.verification_record_value
  )
  let stepCounter = 0
  const nextStep = () => ++stepCounter
  const progressStep = domain ? getProgressStep(domain.status) : 0
  const hasProblem = domain?.status === 'error' || domain?.status === 'moved'

  return (
    <section
      aria-labelledby="settings-domain-title"
      className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] lg:gap-10"
    >
      <div className="space-y-3">
        <div className="space-y-1">
          <h2
            id="settings-domain-title"
            className="text-foreground text-base font-semibold tracking-[-0.01em]"
          >
            {t.heading}
          </h2>
          <p className="text-muted-foreground max-w-xs text-sm leading-6">
            {t.subheading}
          </p>
        </div>
        <p className="text-muted-foreground flex max-w-xs gap-2 text-xs leading-5">
          <Info className="mt-0.5 size-3.5 shrink-0" aria-hidden="true" />
          {t.requirement}
        </p>
      </div>

      <div className="bg-card ring-border overflow-hidden rounded-xl shadow-[0_1px_2px_rgba(0,0,0,0.04)] ring-1">
        {/* Hostname form */}
        <form
          className="space-y-1.5 p-5 sm:p-6"
          onSubmit={(event) => {
            event.preventDefault()
            handleConnect()
          }}
        >
          <Label htmlFor="custom-domain" className="text-foreground">
            {t.hostnameLabel}
          </Label>
          <div className="flex flex-col gap-2 sm:flex-row">
            <div className="relative flex-1">
              <Globe
                className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2"
                aria-hidden="true"
              />
              <Input
                id="custom-domain"
                value={hostname}
                onChange={(event) => setHostname(event.target.value)}
                placeholder={t.hostnamePlaceholder}
                className="pl-9 font-mono text-sm md:text-sm"
                autoCapitalize="off"
                autoCorrect="off"
                autoComplete="off"
                inputMode="url"
                spellCheck={false}
                aria-describedby="custom-domain-hint"
              />
            </div>
            <Button
              type="submit"
              disabled={isPending || !canConnect}
              variant={domain && !isReplacing ? 'outline' : 'default'}
            >
              {isPending ? (
                <Loader2 className="animate-spin" aria-hidden="true" />
              ) : null}
              {domain ? (isReplacing ? t.replace : t.connect) : t.connect}
            </Button>
          </div>
          <p id="custom-domain-hint" className="text-muted-foreground text-xs">
            {t.hostnameHint}
          </p>
        </form>

        {!domain ? (
          <div className="bg-muted/40 border-border text-muted-foreground border-t px-5 py-3.5 text-xs sm:px-6">
            {t.noDomain}
          </div>
        ) : (
          <>
            {/* Status */}
            <div className="border-border space-y-5 border-t p-5 sm:p-6">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex min-w-0 items-start gap-3">
                  <span className="bg-secondary text-secondary-foreground flex size-8 shrink-0 items-center justify-center rounded-lg">
                    <Globe className="size-4" aria-hidden="true" />
                  </span>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-foreground truncate font-mono text-sm font-medium">
                        {domain.hostname}
                      </p>
                      {statusMeta ? (
                        <Badge variant={statusMeta.variant}>
                          {domain.status === 'active' ? (
                            <CheckCircle2 aria-hidden="true" />
                          ) : null}
                          {statusMeta.label}
                        </Badge>
                      ) : null}
                    </div>
                    {statusMeta ? (
                      <p className="text-muted-foreground mt-1 text-xs leading-5">
                        {statusMeta.description}
                      </p>
                    ) : null}
                  </div>
                </div>
                {domain.status === 'active' ? (
                  <Button variant="outline" size="sm" asChild>
                    <a
                      href={`https://${domain.hostname}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {t.visit}
                      <ArrowUpRight aria-hidden="true" />
                      <span className="sr-only">
                        (https://{domain.hostname}, se abre en una pestaña
                        nueva)
                      </span>
                    </a>
                  </Button>
                ) : null}
              </div>

              {/* Progress */}
              <ol
                aria-label={t.progressLabel}
                className="grid grid-cols-2 gap-x-3 gap-y-3 sm:grid-cols-4"
              >
                {t.progressSteps.map((label, index) => {
                  const done = index < progressStep || progressStep === 3
                  const current = index === progressStep && progressStep < 3
                  const failed = current && hasProblem
                  return (
                    <li key={label} className="space-y-1.5">
                      <span
                        aria-hidden="true"
                        className={cn(
                          'block h-1 rounded-full',
                          done
                            ? 'bg-primary'
                            : failed
                              ? 'bg-destructive'
                              : current
                                ? 'bg-warning'
                                : 'bg-muted'
                        )}
                      />
                      <span
                        className={cn(
                          'flex items-center gap-1 text-xs',
                          done || current
                            ? 'text-foreground font-medium'
                            : 'text-muted-foreground'
                        )}
                      >
                        {done ? (
                          <Check
                            className="text-primary size-3"
                            aria-hidden="true"
                          />
                        ) : null}
                        {label}
                        <span className="sr-only">
                          {done
                            ? ' (completado)'
                            : failed
                              ? ' (con errores)'
                              : current
                                ? ' (en curso)'
                                : ' (pendiente)'}
                        </span>
                      </span>
                    </li>
                  )
                })}
              </ol>

              <dl className="bg-muted/40 ring-border grid gap-3 rounded-lg p-3.5 text-xs ring-1 sm:grid-cols-3">
                <div>
                  <dt className="text-muted-foreground">{t.sslStatus}</dt>
                  <dd className="text-foreground mt-0.5 font-medium">
                    {domain.cloudflare_ssl_status || '—'}
                  </dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">{t.lastCheck}</dt>
                  <dd className="text-foreground mt-0.5 font-medium tabular-nums">
                    {formatDateTime(domain.last_checked_at)}
                  </dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">{t.activatedAt}</dt>
                  <dd className="text-foreground mt-0.5 font-medium tabular-nums">
                    {formatDateTime(domain.activated_at)}
                  </dd>
                </div>
              </dl>

              {domain.status === 'error' ? (
                <div
                  role="alert"
                  className="border-destructive/20 bg-destructive/5 flex gap-3 rounded-lg border p-3.5"
                >
                  <AlertTriangle
                    className="text-destructive mt-0.5 size-4 shrink-0"
                    aria-hidden="true"
                  />
                  <div className="min-w-0 space-y-1">
                    <p className="text-destructive text-sm font-medium">
                      {t.validationErrors}
                    </p>
                    {validationErrors.length > 0 ? (
                      <ul className="text-foreground/80 list-disc space-y-1 pl-4 text-xs leading-5">
                        {validationErrors.map((errorMessage, index) => (
                          <li key={`${errorMessage}-${index}`}>
                            {errorMessage}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-foreground/80 text-xs">
                        {t.noValidationErrorDetails}
                      </p>
                    )}
                  </div>
                </div>
              ) : null}
            </div>

            {/* DNS records */}
            {needsDnsSetup ? (
              <div className="border-border border-t">
                <div className="px-5 pt-5 sm:px-6">
                  <h3 className="text-foreground text-sm font-semibold">
                    {t.dnsTitle}
                  </h3>
                  <p className="text-muted-foreground mt-0.5 text-xs leading-5">
                    {t.dnsSubtitle}
                  </p>
                </div>

                <ol className="divide-border divide-y">
                  {dnsTarget ? (
                    <DnsStep
                      number={nextStep()}
                      title={t.cnameTitle}
                      description={t.cnameDesc}
                      recordType="CNAME"
                    >
                      <dl className="space-y-2">
                        <DnsField
                          label={t.host}
                          value={formatDnsHost(domain.hostname)}
                          copied={copiedKey === 'cname-host'}
                          onCopy={() =>
                            copyValue(
                              formatDnsHost(domain.hostname),
                              'cname-host'
                            )
                          }
                        />
                        <DnsField
                          label={t.target}
                          value={dnsTarget}
                          copied={copiedKey === 'cname-target'}
                          onCopy={() => copyValue(dnsTarget, 'cname-target')}
                        />
                      </dl>
                    </DnsStep>
                  ) : null}

                  {hasOwnershipRecord ? (
                    <DnsStep
                      number={nextStep()}
                      title={t.ownershipTitle}
                      description={t.ownershipDesc}
                      recordType="TXT"
                    >
                      <dl className="space-y-2">
                        <DnsField
                          label={t.host}
                          value={formatDnsHost(domain.verification_record_name)}
                          copied={copiedKey === 'txt-host'}
                          onCopy={() =>
                            copyValue(
                              formatDnsHost(domain.verification_record_name),
                              'txt-host'
                            )
                          }
                        />
                        <DnsField
                          label={t.value}
                          value={domain.verification_record_value || ''}
                          copied={copiedKey === 'txt-value'}
                          onCopy={() =>
                            copyValue(
                              domain.verification_record_value || '',
                              'txt-value'
                            )
                          }
                        />
                      </dl>
                    </DnsStep>
                  ) : null}

                  <DnsStep
                    number={nextStep()}
                    title={t.sslTitle}
                    description={
                      sslValidationRecords.length > 0 ? t.sslDesc : undefined
                    }
                  >
                    {sslValidationRecords.length > 0 ? (
                      <div className="space-y-3">
                        {sslValidationRecords.map((record, index) => {
                          const hasTxt = Boolean(
                            record.txt_name && record.txt_value
                          )
                          const hasHttp = Boolean(
                            record.http_url && record.http_body
                          )

                          return (
                            <div
                              key={`ssl-validation-${index}`}
                              className="ring-border space-y-2.5 rounded-lg p-3 ring-1"
                            >
                              <p className="text-muted-foreground text-xs font-medium">
                                {hasTxt
                                  ? t.sslTxt
                                  : hasHttp
                                    ? t.sslHttp
                                    : 'TXT'}
                                {sslValidationRecords.length > 1 ? (
                                  <span className="tabular-nums">
                                    {' '}
                                    · {index + 1}/{sslValidationRecords.length}
                                  </span>
                                ) : null}
                              </p>

                              {hasTxt ? (
                                <dl className="space-y-2">
                                  <DnsField
                                    label={t.host}
                                    value={formatDnsHost(record.txt_name)}
                                    copied={
                                      copiedKey === `ssl-txt-host-${index}`
                                    }
                                    onCopy={() =>
                                      copyValue(
                                        formatDnsHost(record.txt_name),
                                        `ssl-txt-host-${index}`
                                      )
                                    }
                                  />
                                  <DnsField
                                    label={t.value}
                                    value={record.txt_value || ''}
                                    copied={
                                      copiedKey === `ssl-txt-value-${index}`
                                    }
                                    onCopy={() =>
                                      copyValue(
                                        record.txt_value || '',
                                        `ssl-txt-value-${index}`
                                      )
                                    }
                                  />
                                </dl>
                              ) : null}

                              {hasHttp ? (
                                <dl className="space-y-2">
                                  <DnsField
                                    label={t.url}
                                    value={record.http_url || ''}
                                    copied={
                                      copiedKey === `ssl-http-url-${index}`
                                    }
                                    onCopy={() =>
                                      copyValue(
                                        record.http_url || '',
                                        `ssl-http-url-${index}`
                                      )
                                    }
                                  />
                                  <DnsField
                                    label={t.body}
                                    value={record.http_body || ''}
                                    copied={
                                      copiedKey === `ssl-http-body-${index}`
                                    }
                                    onCopy={() =>
                                      copyValue(
                                        record.http_body || '',
                                        `ssl-http-body-${index}`
                                      )
                                    }
                                  />
                                </dl>
                              ) : null}
                            </div>
                          )
                        })}
                      </div>
                    ) : (
                      <p className="bg-muted/40 text-muted-foreground flex gap-2 rounded-lg p-3 text-xs leading-5">
                        <Clock
                          className="mt-0.5 size-3.5 shrink-0"
                          aria-hidden="true"
                        />
                        {t.noSslValidationRecords}
                      </p>
                    )}
                  </DnsStep>
                </ol>
              </div>
            ) : (
              <div className="border-border border-t px-5 py-4 sm:px-6">
                <p className="text-success flex items-center gap-2 text-sm">
                  <CheckCircle2
                    className="size-4 shrink-0"
                    aria-hidden="true"
                  />
                  {t.activeDnsInfo}
                </p>
              </div>
            )}

            {/* Footer */}
            <div className="bg-muted/40 border-border flex flex-col gap-3 border-t px-5 py-3.5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
              <p className="text-muted-foreground text-xs leading-5">
                {t.propagationHint}
              </p>
              <div className="flex shrink-0 items-center gap-2">
                <Button
                  type="button"
                  onClick={handleDisconnect}
                  disabled={isPending || !domain}
                  variant="ghost"
                  size="sm"
                  className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                >
                  <Trash2 aria-hidden="true" />
                  {t.disconnect}
                </Button>
                <Button
                  type="button"
                  onClick={handleRefresh}
                  disabled={isPending || !domain}
                  variant="outline"
                  size="sm"
                >
                  {isPending ? (
                    <Loader2 className="animate-spin" aria-hidden="true" />
                  ) : (
                    <RefreshCcw aria-hidden="true" />
                  )}
                  {isPending ? t.refreshing : t.refresh}
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  )
}
