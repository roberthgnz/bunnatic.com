'use client'

import { useMemo, useState, useTransition } from 'react'
import { Check, Copy, Globe, Loader2, RefreshCcw, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import {
  connectBusinessDomain,
  disconnectBusinessDomain,
  refreshBusinessDomainStatus,
} from '@/lib/supabase/actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'

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
  cloudflare_verification_errors?: Array<{ message?: string; error?: string } | string> | null
  activated_at: string | null
  last_checked_at: string | null
}

function formatDateTime(value: string | null, locale: 'es' | 'ca') {
  if (!value) return '—'

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) {
    return '—'
  }

  const formatter = new Intl.DateTimeFormat(locale === 'ca' ? 'ca-ES' : 'es-ES', {
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

function getStatusMeta(status: DomainStatus, locale: 'es' | 'ca') {
  const labels = {
    es: {
      pending_dns: 'Pendiente DNS',
      pending_ssl: 'Pendiente SSL',
      active: 'Activo',
      moved: 'Movido',
      error: 'Error',
    },
    ca: {
      pending_dns: 'Pendent DNS',
      pending_ssl: 'Pendent SSL',
      active: 'Actiu',
      moved: 'Mogut',
      error: 'Error',
    },
  }[locale]

  const classes: Record<DomainStatus, string> = {
    pending_dns: 'border-amber-200 bg-amber-50 text-amber-700',
    pending_ssl: 'border-blue-200 bg-blue-50 text-blue-700',
    active: 'border-emerald-200 bg-emerald-50 text-emerald-700',
    moved: 'border-slate-200 bg-slate-100 text-slate-700',
    error: 'border-rose-200 bg-rose-50 text-rose-700',
  }

  return {
    label: labels[status],
    className: classes[status],
  }
}

export default function DomainSettingsCard({
  businessSlug,
  locale,
  initialDomain,
  dnsTarget,
  rootDomain,
}: {
  businessSlug: string
  locale: string
  initialDomain: DomainRecord | null
  dnsTarget: string | null
  rootDomain: string | null
}) {
  const safeLocale: 'es' | 'ca' = locale === 'ca' ? 'ca' : 'es'
  const [domain, setDomain] = useState<DomainRecord | null>(initialDomain)
  const [hostname, setHostname] = useState(initialDomain?.hostname || '')
  const [copiedKey, setCopiedKey] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const t = {
    es: {
      heading: 'Dominio personalizado',
      subheading: 'Conecta tu dominio y gestiona la validación DNS/SSL desde aquí.',
      hostnameLabel: 'Dominio',
      hostnameHint: 'Ejemplo: www.tunegocio.com',
      connect: 'Conectar dominio',
      replace: 'Reemplazar dominio',
      refreshing: 'Actualizando…',
      refresh: 'Actualizar estado',
      disconnect: 'Desconectar',
      noDomain: 'Aún no hay dominio conectado.',
      dnsTitle: 'Configura estos registros DNS',
      dnsSubtitle: 'Copia exactamente estos valores en el panel DNS de tu proveedor.',
      step1: 'Paso 1 (solo una vez): crea/actualiza el CNAME principal',
      step2: 'Paso 2: valida propiedad del dominio (Ownership)',
      step3: 'Paso 3: valida certificado SSL (DCV)',
      multipleTxtHint: 'Si ves varias filas TXT con el mismo host, crea todas (una por valor).',
      activeDnsInfo: 'Dominio activo. No necesitas crear más registros DNS salvo cambios futuros.',
      cname: 'CNAME',
      txt: 'TXT de validación',
      ownershipTxt: 'TXT Ownership',
      sslTxt: 'TXT SSL (DCV)',
      sslHttp: 'HTTP SSL (DCV)',
      url: 'URL',
      body: 'Body',
      noSslValidationRecords: 'Cloudflare aún no devolvió registros SSL/DCV para este dominio.',
      host: 'Host',
      target: 'Target',
      value: 'Valor',
      copy: 'Copiar',
      copied: 'Copiado',
      copyError: 'No se pudo copiar al portapapeles.',
      status: 'Estado',
      validationErrors: 'Errores de validación',
      noValidationErrorDetails: 'Cloudflare marcó error, pero no devolvió detalle adicional.',
      sslStatus: 'Estado SSL',
      lastCheck: 'Última comprobación',
      activatedAt: 'Activado el',
      liveUrl: 'URL activa',
      successConnect: 'Dominio conectado. Completa DNS y vuelve a actualizar estado.',
      successRefresh: 'Estado del dominio actualizado.',
      successDisconnect: 'Dominio desconectado correctamente.',
      copyHint: 'Puedes tardar algunos minutos hasta que Cloudflare lo marque como activo.',
    },
    ca: {
      heading: 'Domini personalitzat',
      subheading: 'Connecta el teu domini i gestiona la validació DNS/SSL des d’aquí.',
      hostnameLabel: 'Domini',
      hostnameHint: 'Exemple: www.elteunegoci.com',
      connect: 'Connectar domini',
      replace: 'Substituir domini',
      refreshing: 'Actualitzant…',
      refresh: 'Actualitzar estat',
      disconnect: 'Desconnectar',
      noDomain: 'Encara no hi ha cap domini connectat.',
      dnsTitle: 'Configura aquests registres DNS',
      dnsSubtitle: 'Copia exactament aquests valors al panell DNS del teu proveïdor.',
      step1: 'Pas 1 (només una vegada): crea/actualitza el CNAME principal',
      step2: 'Pas 2: valida propietat del domini (Ownership)',
      step3: 'Pas 3: valida el certificat SSL (DCV)',
      multipleTxtHint: 'Si veus diverses files TXT amb el mateix host, crea-les totes (una per valor).',
      activeDnsInfo: 'Domini actiu. No necessites crear més registres DNS excepte si hi ha canvis futurs.',
      cname: 'CNAME',
      txt: 'TXT de validació',
      ownershipTxt: 'TXT Ownership',
      sslTxt: 'TXT SSL (DCV)',
      sslHttp: 'HTTP SSL (DCV)',
      url: 'URL',
      body: 'Body',
      noSslValidationRecords: 'Cloudflare encara no ha retornat registres SSL/DCV per aquest domini.',
      host: 'Host',
      target: 'Target',
      value: 'Valor',
      copy: 'Copiar',
      copied: 'Copiat',
      copyError: 'No s’ha pogut copiar al porta-retalls.',
      status: 'Estat',
      validationErrors: 'Errors de validació',
      noValidationErrorDetails: 'Cloudflare ha marcat error, però no ha retornat cap detall addicional.',
      sslStatus: 'Estat SSL',
      lastCheck: 'Darrera comprovació',
      activatedAt: 'Activat el',
      liveUrl: 'URL activa',
      successConnect: 'Domini connectat. Completa DNS i torna a actualitzar l’estat.',
      successRefresh: 'Estat del domini actualitzat.',
      successDisconnect: 'Domini desconnectat correctament.',
      copyHint: 'Poden passar uns minuts fins que Cloudflare el marqui com a actiu.',
    },
  }[safeLocale]

  const statusMeta = useMemo(() => {
    if (!domain) return null
    return getStatusMeta(domain.status, safeLocale)
  }, [domain, safeLocale])

  const canConnect = hostname.trim().length > 3
  const isReplacing = Boolean(domain && domain.hostname !== hostname.trim().toLowerCase())
  const normalizedRootDomain = rootDomain?.trim().toLowerCase() || null
  const validationErrors = (domain?.cloudflare_verification_errors || [])
    .map((item) => {
      if (typeof item === 'string') return item
      return item?.message || item?.error || ''
    })
    .filter(Boolean)
  const sslValidationRecords = (domain?.cloudflare_ssl_validation_records || [])
    .filter((item): item is NonNullable<DomainRecord['cloudflare_ssl_validation_records']>[number] => Boolean(item))
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

  const dnsSectionCardClass = 'rounded-md border border-slate-200 bg-white p-3 space-y-2'
  const dnsSectionTitleClass = 'text-xs font-semibold text-slate-900'
  const dnsFieldLabelClass = 'text-slate-700'

  return (
    <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
      <div className="border-b border-slate-100 bg-slate-50/60 px-6 py-4">
        <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
          <Globe className="h-4 w-4 text-slate-600" />
          {t.heading}
        </h3>
        <p className="mt-0.5 text-xs text-slate-500">{t.subheading}</p>
      </div>

      <div className="px-6 py-6 space-y-5">
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-slate-900">{t.hostnameLabel}</label>
          <Input
            value={hostname}
            onChange={(event) => setHostname(event.target.value)}
            placeholder={t.hostnameHint}
            className="h-9"
            autoCapitalize="off"
            autoCorrect="off"
            spellCheck={false}
          />
          <p className="text-xs text-slate-500">{t.copyHint}</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            type="button"
            onClick={handleConnect}
            disabled={isPending || !canConnect}
            size="sm"
          >
            {isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : null}
            {domain ? (isReplacing ? t.replace : t.connect) : t.connect}
          </Button>

          <Button
            type="button"
            onClick={handleRefresh}
            disabled={isPending || !domain}
            variant="outline"
            size="sm"
          >
            {isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <RefreshCcw className="h-3.5 w-3.5" />}
            {isPending ? t.refreshing : t.refresh}
          </Button>

          <Button
            type="button"
            onClick={handleDisconnect}
            disabled={isPending || !domain}
            variant="ghost"
            size="sm"
            className="text-rose-600 hover:text-rose-700 hover:bg-rose-50"
          >
            <Trash2 className="h-3.5 w-3.5" />
            {t.disconnect}
          </Button>
        </div>

        {!domain ? (
          <p className="text-sm text-slate-500">{t.noDomain}</p>
        ) : (
          <div className="space-y-4 rounded-lg border border-slate-100 bg-slate-50/40 p-4">
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <p className="text-sm font-medium text-slate-900">{domain.hostname}</p>
              {statusMeta ? <Badge variant="outline" className={statusMeta.className}>{statusMeta.label}</Badge> : null}
            </div>

            {domain.status === 'active' ? (
              <a
                href={`https://${domain.hostname}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-emerald-700 hover:text-emerald-800 hover:underline"
              >
                {t.liveUrl}: https://{domain.hostname}
              </a>
            ) : null}

            <div className="grid gap-3 md:grid-cols-2 text-xs text-slate-600">
              <div>
                <p className="font-medium text-slate-700">{t.status}</p>
                <p>{domain.status}</p>
              </div>
              <div>
                <p className="font-medium text-slate-700">{t.sslStatus}</p>
                <p>{domain.cloudflare_ssl_status || '—'}</p>
              </div>
              <div>
                <p className="font-medium text-slate-700">{t.lastCheck}</p>
                <p>{formatDateTime(domain.last_checked_at, safeLocale)}</p>
              </div>
              <div>
                <p className="font-medium text-slate-700">{t.activatedAt}</p>
                <p>{formatDateTime(domain.activated_at, safeLocale)}</p>
              </div>
            </div>

            {domain.status === 'error' ? (
              <div className="rounded-md border border-rose-200 bg-rose-50 p-3">
                <p className="text-xs font-semibold text-rose-900 mb-2">{t.validationErrors}</p>
                {validationErrors.length > 0 ? (
                  <ul className="space-y-1 text-xs text-rose-800 list-disc pl-4">
                    {validationErrors.map((errorMessage, index) => (
                      <li key={`${errorMessage}-${index}`}>{errorMessage}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-xs text-rose-800">{t.noValidationErrorDetails}</p>
                )}
              </div>
            ) : null}

            <div className="space-y-3 border-t border-slate-200 pt-3">
              <div>
                <p className="text-sm font-semibold text-slate-900">{t.dnsTitle}</p>
                <p className="text-xs text-slate-600 mt-0.5">{t.dnsSubtitle}</p>
              </div>

              {!needsDnsSetup ? (
                <p className="text-xs text-emerald-700">{t.activeDnsInfo}</p>
              ) : null}

              {needsDnsSetup && dnsTarget ? (
                <div className={dnsSectionCardClass}>
                  <p className={dnsSectionTitleClass}>{t.step1}</p>
                  <p className="text-xs text-slate-500">{t.cname}</p>
                  <div className="grid gap-2 text-xs">
                    <div className="flex items-center justify-between gap-2">
                      <span className={dnsFieldLabelClass}>{t.host}</span>
                      <div className="flex items-center gap-2">
                        <code className="rounded bg-white/80 px-2 py-1 font-mono text-slate-900">{formatDnsHost(domain.hostname)}</code>
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          className="h-7 px-2 text-[11px]"
                          onClick={() => copyValue(formatDnsHost(domain.hostname), 'cname-host')}
                        >
                          {copiedKey === 'cname-host' ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                          {copiedKey === 'cname-host' ? t.copied : t.copy}
                        </Button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-2">
                      <span className={dnsFieldLabelClass}>{t.target}</span>
                      <div className="flex items-center gap-2">
                        <code className="rounded bg-white/80 px-2 py-1 font-mono text-slate-900">{dnsTarget}</code>
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          className="h-7 px-2 text-[11px]"
                          onClick={() => copyValue(dnsTarget, 'cname-target')}
                        >
                          {copiedKey === 'cname-target' ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                          {copiedKey === 'cname-target' ? t.copied : t.copy}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ) : null}

              {needsDnsSetup && domain.verification_record_name && domain.verification_record_value ? (
                <div className={dnsSectionCardClass}>
                  <p className={dnsSectionTitleClass}>{t.step2}</p>
                  <p className="text-xs text-slate-500">{t.ownershipTxt}</p>
                  <div className="grid gap-2 text-xs">
                    <div className="flex items-center justify-between gap-2">
                      <span className={dnsFieldLabelClass}>{t.host}</span>
                      <div className="flex items-center gap-2">
                        <code className="rounded bg-white/80 px-2 py-1 font-mono text-slate-900">{formatDnsHost(domain.verification_record_name)}</code>
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          className="h-7 px-2 text-[11px]"
                          onClick={() => copyValue(formatDnsHost(domain.verification_record_name), 'txt-host')}
                        >
                          {copiedKey === 'txt-host' ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                          {copiedKey === 'txt-host' ? t.copied : t.copy}
                        </Button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-2">
                      <span className={dnsFieldLabelClass}>{t.value}</span>
                      <div className="flex items-center gap-2">
                        <code className="rounded bg-white/80 px-2 py-1 font-mono text-slate-900">{domain.verification_record_value}</code>
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          className="h-7 px-2 text-[11px]"
                          onClick={() => copyValue(domain.verification_record_value || '', 'txt-value')}
                        >
                          {copiedKey === 'txt-value' ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                          {copiedKey === 'txt-value' ? t.copied : t.copy}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ) : null}

              {needsDnsSetup && sslValidationRecords.length > 0 ? (
                <div className="space-y-2">
                  <p className="text-xs text-slate-600">{t.step3}</p>
                  <p className="text-xs text-slate-500">{t.multipleTxtHint}</p>
                  {sslValidationRecords.map((record, index) => {
                    const hasTxt = Boolean(record.txt_name && record.txt_value)
                    const hasHttp = Boolean(record.http_url && record.http_body)

                    return (
                      <div key={`ssl-validation-${index}`} className={dnsSectionCardClass}>
                        <p className={dnsSectionTitleClass}>
                          {hasTxt ? t.sslTxt : hasHttp ? t.sslHttp : t.txt}
                        </p>

                        {hasTxt ? (
                          <div className="grid gap-2 text-xs">
                            <div className="flex items-center justify-between gap-2">
                              <span className={dnsFieldLabelClass}>{t.host}</span>
                              <div className="flex items-center gap-2">
                                <code className="rounded bg-white/80 px-2 py-1 font-mono text-slate-900">{formatDnsHost(record.txt_name)}</code>
                                <Button
                                  type="button"
                                  size="sm"
                                  variant="outline"
                                  className="h-7 px-2 text-[11px]"
                                  onClick={() => copyValue(formatDnsHost(record.txt_name), `ssl-txt-host-${index}`)}
                                >
                                  {copiedKey === `ssl-txt-host-${index}` ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                                  {copiedKey === `ssl-txt-host-${index}` ? t.copied : t.copy}
                                </Button>
                              </div>
                            </div>

                            <div className="flex items-center justify-between gap-2">
                              <span className={dnsFieldLabelClass}>{t.value}</span>
                              <div className="flex items-center gap-2">
                                <code className="rounded bg-white/80 px-2 py-1 font-mono text-slate-900">{record.txt_value}</code>
                                <Button
                                  type="button"
                                  size="sm"
                                  variant="outline"
                                  className="h-7 px-2 text-[11px]"
                                  onClick={() => copyValue(record.txt_value || '', `ssl-txt-value-${index}`)}
                                >
                                  {copiedKey === `ssl-txt-value-${index}` ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                                  {copiedKey === `ssl-txt-value-${index}` ? t.copied : t.copy}
                                </Button>
                              </div>
                            </div>
                          </div>
                        ) : null}

                        {hasHttp ? (
                          <div className="grid gap-2 text-xs">
                            <div className="flex items-center justify-between gap-2">
                              <span className={dnsFieldLabelClass}>{t.url}</span>
                              <div className="flex items-center gap-2">
                                <code className="rounded bg-white/80 px-2 py-1 font-mono text-slate-900 break-all">{record.http_url}</code>
                                <Button
                                  type="button"
                                  size="sm"
                                  variant="outline"
                                  className="h-7 px-2 text-[11px]"
                                  onClick={() => copyValue(record.http_url || '', `ssl-http-url-${index}`)}
                                >
                                  {copiedKey === `ssl-http-url-${index}` ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                                  {copiedKey === `ssl-http-url-${index}` ? t.copied : t.copy}
                                </Button>
                              </div>
                            </div>

                            <div className="flex items-center justify-between gap-2">
                              <span className={dnsFieldLabelClass}>{t.body}</span>
                              <div className="flex items-center gap-2">
                                <code className="rounded bg-white/80 px-2 py-1 font-mono text-slate-900 break-all">{record.http_body}</code>
                                <Button
                                  type="button"
                                  size="sm"
                                  variant="outline"
                                  className="h-7 px-2 text-[11px]"
                                  onClick={() => copyValue(record.http_body || '', `ssl-http-body-${index}`)}
                                >
                                  {copiedKey === `ssl-http-body-${index}` ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                                  {copiedKey === `ssl-http-body-${index}` ? t.copied : t.copy}
                                </Button>
                              </div>
                            </div>
                          </div>
                        ) : null}
                      </div>
                    )
                  })}
                </div>
              ) : needsDnsSetup ? (
                <p className="text-xs text-slate-600">{t.noSslValidationRecords}</p>
              ) : null}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
