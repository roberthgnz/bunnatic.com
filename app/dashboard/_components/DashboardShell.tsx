import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarInset,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from '@/components/ui/sidebar'
import { Separator } from '@/components/ui/separator'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import {
  ChevronDown,
  MessageSquarePlus,
  Bug,
  Lightbulb,
  Leaf,
  Plus,
  Sparkles,
} from 'lucide-react'
import Link from 'next/link'
import { logout } from '@/lib/supabase/actions'
import { TeamSwitcher } from '@/components/team-switcher'
import { NavUser } from '@/components/nav-user'
import { SidebarMainItems, SidebarTopItems } from './SidebarNav'
import { DashboardBreadcrumbs } from './DashboardBreadcrumbs'
import { createClient } from '@/lib/supabase/server'
import { mapStripePriceIdToGenerationPlan } from '@/lib/businessSourceGeneration'
import { dashboardContent } from './dashboard-constants'

export default async function DashboardShell({
  children,
}: {
  children: React.ReactNode
}) {
  const t = dashboardContent
  const localePrefix = ''

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  let userProfile = null
  let businesses: { id: string; name: string; slug: string }[] = []

  if (user) {
    const [profileRes, businessesRes] = await Promise.all([
      supabase
        .from('profiles')
        .select('full_name, avatar_url, stripe_price_id')
        .eq('id', user.id)
        .maybeSingle(),
      supabase
        .from('businesses')
        .select('id, name, slug')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false }),
    ])

    const profileData = profileRes.data
    const businessesData = businessesRes.data || []

    const plan = mapStripePriceIdToGenerationPlan(
      profileData?.stripe_price_id ?? null
    )

    userProfile = {
      full_name:
        profileData?.full_name || user?.user_metadata?.full_name || null,
      email: user.email,
      avatar_url: profileData?.avatar_url || null,
      plan,
    }

    businesses = businessesData
  }

  const getPlanName = (planKey: string | undefined) => {
    if (!planKey) return t.plans.starter
    return t.plans[planKey as keyof typeof t.plans] || t.plans.starter
  }

  const teamSwitcherItems =
    businesses.length > 0
      ? businesses.map((business) => ({
          name: business.name,
          plan: getPlanName(userProfile?.plan),
          href: `${localePrefix}/dashboard/businesses/${business.slug}`,
        }))
      : [
          {
            name: t.title,
            plan: t.enterprise,
            href: `${localePrefix}/dashboard/businesses`,
          },
        ]

  const planName = getPlanName(userProfile?.plan)
  const showUpgrade = userProfile?.plan !== 'scale'

  return (
    <SidebarProvider>
      <Sidebar collapsible="icon" className="border-sidebar-border border-r">
        <SidebarHeader className="gap-3 px-3 pt-4 pb-2">
          <Link
            href="/dashboard"
            className="focus-visible:ring-ring flex items-center gap-2 rounded-md px-1 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0 focus-visible:ring-2 focus-visible:outline-none"
          >
            <span className="bg-primary flex size-7 shrink-0 items-center justify-center rounded-lg">
              <Leaf className="size-3.5 text-[#d8e7b7]" aria-hidden="true" />
            </span>
            <span className="text-sidebar-foreground text-[17px] font-semibold tracking-[-0.04em] group-data-[collapsible=icon]:hidden">
              Bunnatic
            </span>
          </Link>
          <TeamSwitcher
            teams={teamSwitcherItems}
            teamLabel={t.businesses}
            addTeamLabel={t.addBusiness}
            addTeamHref={`${localePrefix}/dashboard/new`}
          />
        </SidebarHeader>

        <SidebarContent className="pt-2">
          <SidebarGroup>
            <SidebarMainItems t={t} />
          </SidebarGroup>

          <SidebarGroup className="mt-auto gap-3">
            {showUpgrade ? (
              <div className="bg-card ring-sidebar-border rounded-xl p-3.5 shadow-[0_1px_2px_rgba(31,42,28,0.05)] ring-1 group-data-[collapsible=icon]:hidden">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sidebar-foreground/60 text-[11px] font-semibold tracking-[0.12em] uppercase">
                    Tu plan
                  </p>
                  <span className="bg-secondary text-secondary-foreground rounded-full px-2 py-0.5 text-[11px] font-medium">
                    {planName}
                  </span>
                </div>
                <p className="text-sidebar-foreground mt-2 text-[13px] leading-5">
                  Más webs, dominio propio y generación IA ilimitada.
                </p>
                <Button asChild size="sm" className="mt-3 w-full">
                  <Link href={`${localePrefix}/dashboard/subscription`}>
                    <Sparkles aria-hidden="true" />
                    Mejorar plan
                  </Link>
                </Button>
              </div>
            ) : null}
            <SidebarGroupContent>
              <SidebarTopItems t={t} />
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter className="border-sidebar-border border-t p-2">
          <NavUser
            user={{
              name: userProfile?.full_name || 'Usuario',
              email: userProfile?.email || '',
              avatar: userProfile?.avatar_url || '',
            }}
            labels={{
              upgrade: 'Mejorar plan',
              account: t.menu.account,
              billing: t.menu.billing,
              notifications: t.menu.notifications,
              logout: t.menu.logout,
            }}
            hrefs={{
              upgrade: showUpgrade
                ? `${localePrefix}/dashboard/subscription`
                : undefined,
              account: `${localePrefix}/dashboard/profile`,
              billing: `${localePrefix}/dashboard/subscription`,
            }}
            onLogout={logout}
          />
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>
      <SidebarInset className="bg-background">
        <header className="bg-background/80 supports-[backdrop-filter]:bg-background/70 sticky top-0 z-30 flex h-14 shrink-0 items-center justify-between gap-2 border-b px-4 backdrop-blur-md md:px-6">
          <div className="flex min-w-0 items-center gap-2">
            <SidebarTrigger className="text-muted-foreground -ml-1.5" />
            <Separator
              orientation="vertical"
              className="mr-1.5 data-[orientation=vertical]:h-4"
            />
            <DashboardBreadcrumbs t={t} />
          </div>
          <div className="flex items-center gap-1.5">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground"
                >
                  <MessageSquarePlus aria-hidden="true" />
                  <span className="hidden sm:inline">
                    {t.menu.giveFeedback}
                  </span>
                  <ChevronDown className="hidden sm:block" aria-hidden="true" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-44">
                <DropdownMenuItem asChild>
                  <Link
                    href={`mailto:hello@bunnatic.com?subject=${encodeURIComponent(t.menu.feedbackIssue)}`}
                  >
                    <Bug className="size-4" />
                    {t.menu.feedbackIssue}
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link
                    href={`mailto:hello@bunnatic.com?subject=${encodeURIComponent(t.menu.feedbackIdea)}`}
                  >
                    <Lightbulb className="size-4" />
                    {t.menu.feedbackIdea}
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button asChild size="sm">
              <Link href={`${localePrefix}/dashboard/new`}>
                <Plus aria-hidden="true" />
                <span className="hidden sm:inline">{t.menu.newBusiness}</span>
              </Link>
            </Button>
          </div>
        </header>
        <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 px-4 py-6 md:px-8 md:py-10">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
