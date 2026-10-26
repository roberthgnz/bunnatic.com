import { getProfile, updateProfile } from '@/lib/db/actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { EmptyState, PageHeader } from '@/components/dashboard/page-header'
import { Mail, UserCircle } from 'lucide-react'

function getInitials(name: string | null | undefined) {
  const parts = (name ?? '').trim().split(/\s+/).filter(Boolean)
  if (!parts.length) return null
  if (parts.length === 1) return parts[0][0]?.toUpperCase() ?? null
  return `${parts[0][0] ?? ''}${parts[1][0] ?? ''}`.toUpperCase()
}

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const profile = await getProfile()

  const t = {
    es: {
      eyebrow: 'Cuenta',
      title: 'Tu',
      accent: 'perfil',
      subtitle:
        'Gestiona tu información personal y cómo te ven los miembros de tu equipo.',
      cardTitle: 'Información personal',
      cardDescription:
        'Estos datos se usan en tu cuenta y en las comunicaciones de Locavo.',
      fullName: 'Nombre completo',
      fullNamePlaceholder: 'Ej. Laura Martínez',
      username: 'Nombre de usuario',
      usernamePlaceholder: 'Ej. laura',
      website: 'Sitio web',
      websitePlaceholder: 'https://tunegocio.es',
      websiteHint: 'Opcional. Tu web personal o la de tu empresa.',
      save: 'Guardar cambios',
      email: 'Email de acceso',
      emailHint: 'Es el email con el que inicias sesión.',
      errorTitle: 'No hemos podido cargar tu perfil',
      errorDescription:
        'Vuelve a cargar la página. Si el problema continúa, cierra sesión y vuelve a entrar.',
    },
    ca: {
      eyebrow: 'Compte',
      title: 'El teu',
      accent: 'perfil',
      subtitle:
        'Gestiona la teva informació personal i com et veuen els membres del teu equip.',
      cardTitle: 'Informació personal',
      cardDescription:
        "Aquestes dades s'utilitzen al teu compte i a les comunicacions de Locavo.",
      fullName: 'Nom complet',
      fullNamePlaceholder: 'Ex. Laura Martínez',
      username: "Nom d'usuari",
      usernamePlaceholder: 'Ex. laura',
      website: 'Lloc web',
      websitePlaceholder: 'https://elteunegoci.cat',
      websiteHint: 'Opcional. La teva web personal o la de la teva empresa.',
      save: 'Desar canvis',
      email: "Email d'accés",
      emailHint: "És l'email amb què inicies sessió.",
      errorTitle: 'No hem pogut carregar el teu perfil',
      errorDescription:
        'Torna a carregar la pàgina. Si el problema continua, tanca la sessió i torna a entrar.',
    },
  }[locale === 'ca' ? 'ca' : 'es']

  if (!profile) {
    return (
      <EmptyState
        icon={UserCircle}
        title={t.errorTitle}
        description={t.errorDescription}
      />
    )
  }

  async function handleProfileUpdate(formData: FormData) {
    'use server'
    await updateProfile(formData)
  }

  const initials = getInitials(profile.full_name)

  return (
    <div className="max-w-3xl space-y-8">
      <PageHeader
        eyebrow={t.eyebrow}
        title={t.title}
        accent={t.accent}
        description={t.subtitle}
      />

      <section
        aria-labelledby="profile-account-title"
        className="bg-card ring-border flex items-center gap-4 rounded-xl p-5 shadow-[0_1px_2px_rgba(0,0,0,0.04)] ring-1"
      >
        <div className="bg-secondary text-secondary-foreground ring-border flex size-14 shrink-0 items-center justify-center overflow-hidden rounded-full ring-1">
          {profile.avatar_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={profile.avatar_url}
              alt=""
              className="size-full rounded-full object-cover"
            />
          ) : initials ? (
            <span aria-hidden="true" className="text-base font-semibold">
              {initials}
            </span>
          ) : (
            <UserCircle className="size-7" aria-hidden="true" />
          )}
        </div>
        <div className="min-w-0">
          <h2
            id="profile-account-title"
            className="text-foreground truncate text-base font-semibold tracking-[-0.01em]"
          >
            {profile.full_name || profile.email}
          </h2>
          <p className="text-muted-foreground mt-0.5 flex items-center gap-1.5 text-sm">
            <Mail className="size-3.5 shrink-0" aria-hidden="true" />
            <span className="sr-only">{t.email}: </span>
            <span className="truncate">{profile.email}</span>
          </p>
        </div>
      </section>

      <form
        action={handleProfileUpdate}
        aria-labelledby="profile-form-title"
        className="bg-card ring-border overflow-hidden rounded-xl shadow-[0_1px_2px_rgba(0,0,0,0.04)] ring-1"
      >
        <div className="border-border border-b px-5 py-4">
          <h2
            id="profile-form-title"
            className="text-foreground text-base font-semibold tracking-[-0.01em]"
          >
            {t.cardTitle}
          </h2>
          <p className="text-muted-foreground mt-1 text-sm">
            {t.cardDescription}
          </p>
        </div>

        <div className="grid gap-5 px-5 py-5 sm:grid-cols-2">
          <div className="grid gap-2">
            <Label htmlFor="fullName">{t.fullName}</Label>
            <Input
              id="fullName"
              name="fullName"
              autoComplete="name"
              placeholder={t.fullNamePlaceholder}
              defaultValue={profile.full_name || ''}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="username">{t.username}</Label>
            <Input
              id="username"
              name="username"
              autoComplete="username"
              spellCheck={false}
              placeholder={t.usernamePlaceholder}
              defaultValue={profile.username || ''}
            />
          </div>

          <div className="grid gap-2 sm:col-span-2">
            <Label htmlFor="website">{t.website}</Label>
            <Input
              id="website"
              name="website"
              inputMode="url"
              autoComplete="url"
              spellCheck={false}
              placeholder={t.websitePlaceholder}
              aria-describedby="website-hint"
              defaultValue={profile.website || ''}
            />
            <p id="website-hint" className="text-muted-foreground text-xs">
              {t.websiteHint}
            </p>
          </div>

          <div className="grid gap-2 sm:col-span-2">
            <Label htmlFor="email">{t.email}</Label>
            <Input
              id="email"
              type="email"
              value={profile.email ?? ''}
              readOnly
              disabled
              aria-describedby="email-hint"
            />
            <p id="email-hint" className="text-muted-foreground text-xs">
              {t.emailHint}
            </p>
          </div>
        </div>

        <div className="bg-muted/40 border-border flex justify-end border-t px-5 py-3.5">
          <Button type="submit">{t.save}</Button>
        </div>
      </form>
    </div>
  )
}
