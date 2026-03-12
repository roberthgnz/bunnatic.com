import { getProfile, updateProfile } from '@/lib/supabase/actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { UserCircle } from 'lucide-react'

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const profile = await getProfile()

  if (!profile) {
    return <div>Error loading profile</div>
  }

  const t = {
    es: {
      title: 'Tu Perfil',
      subtitle: 'Gestiona tu información personal.',
      fullName: 'Nombre completo',
      username: 'Nombre de usuario',
      website: 'Sitio web',
      save: 'Guardar cambios',
      email: 'Email de acceso',
    },
    ca: {
      title: 'El teu Perfil',
      subtitle: 'Gestiona la teva informació personal.',
      fullName: 'Nom complet',
      username: "Nom d'usuari",
      website: 'Lloc web',
      save: 'Desar canvis',
      email: "Email d'accés",
    },
  }[locale === 'ca' ? 'ca' : 'es']

  async function handleProfileUpdate(formData: FormData) {
    'use server'
    await updateProfile(formData)
  }

  return (
    <div className="max-w-3xl space-y-5">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">{t.title}</h1>
        <p className="text-sm text-slate-600">{t.subtitle}</p>
      </div>

      <div className="rounded-xl border bg-card text-card-foreground">
        <div className="p-6 pt-6">
          <div className="mb-6 flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-full border border-slate-200 bg-slate-100">
              {profile.avatar_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={profile.avatar_url}
                  alt={profile.full_name || ''}
                  className="h-full w-full rounded-full object-cover"
                />
              ) : (
                <UserCircle className="h-8 w-8 text-slate-400" />
              )}
            </div>
            <div>
              <p className="text-sm font-medium text-slate-900">{t.email}</p>
              <p className="text-sm text-slate-600">{profile.email}</p>
            </div>
          </div>

          <form action={handleProfileUpdate} className="space-y-4">
            <div className="grid gap-2">
              <label htmlFor="fullName" className="text-sm font-medium">
                {t.fullName}
              </label>
              <Input
                id="fullName"
                name="fullName"
                defaultValue={profile.full_name || ''}
                className="max-w-md"
              />
            </div>

            <div className="grid gap-2">
              <label htmlFor="username" className="text-sm font-medium">
                {t.username}
              </label>
              <Input
                id="username"
                name="username"
                defaultValue={profile.username || ''}
                className="max-w-md"
              />
            </div>

            <div className="grid gap-2">
              <label htmlFor="website" className="text-sm font-medium">
                {t.website}
              </label>
              <Input
                id="website"
                name="website"
                defaultValue={profile.website || ''}
                className="max-w-md"
              />
            </div>

            <div className="pt-4">
              <Button type="submit">{t.save}</Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
