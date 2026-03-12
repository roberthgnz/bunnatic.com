'use client'

import { useMemo, useState, useTransition } from 'react'
import { Globe, Loader2, RefreshCcw, Trash2 } from 'lucide-react'
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
  activated_at: string | null
  last_checked_at: string | null
}

function formatDateTime(value: string | null) {
  if (!value) return '—'

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) {
    return '—'
  }

  return date.toLocaleString()
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
}: {
  businessSlug: string
  locale: string
  initialDomain: DomainRecord | null
  dnsTarget: string | null
}) {
  const safeLocale: 'es' | 'ca' = locale === 'ca' ? 'ca' : 'es'
  const [domain, setDomain] = useState<DomainRecord | null>(initialDomain)
  const [hostname, setHostname] = useState(initialDomain?.hostname || '')
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
      cname: 'CNAME',
      txt: 'TXT de validación',
      status: 'Estado',
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
      cname: 'CNAME',
      txt: 'TXT de validació',
      status: 'Estat',
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
                <p>{formatDateTime(domain.last_checked_at)}</p>
              </div>
              <div>
                <p className="font-medium text-slate-700">{t.activatedAt}</p>
                <p>{formatDateTime(domain.activated_at)}</p>
              </div>
            </div>

            <div className="space-y-2 border-t border-slate-200 pt-3">
              <p className="text-xs font-medium text-slate-700">{t.dnsTitle}</p>
              {dnsTarget ? (
                <p className="text-xs text-slate-600">
                  <span className="font-medium">{t.cname}</span>: {domain.hostname} → {dnsTarget}
                </p>
              ) : null}
              {domain.verification_record_name && domain.verification_record_value ? (
                <p className="text-xs text-slate-600">
                  <span className="font-medium">{t.txt}</span>: {domain.verification_record_name} → {domain.verification_record_value}
                </p>
              ) : null}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
