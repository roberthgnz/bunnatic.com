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
import { ChevronDown, MessageSquarePlus, Bug, Lightbulb } from 'lucide-react'
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

  return (
    <SidebarProvider>
      <Sidebar collapsible="icon" className="border-sidebar-border/70 border-r">
        <SidebarHeader className="border-sidebar-border border-b">
          <TeamSwitcher
            teams={teamSwitcherItems}
            teamLabel={t.businesses}
            addTeamLabel={t.addBusiness}
            addTeamHref={`${localePrefix}/dashboard/new`}
          />
        </SidebarHeader>

        <SidebarContent className="pt-4">
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMainItems t={t} />
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarGroup className="mt-auto">
            <SidebarGroupContent>
              <SidebarTopItems t={t} />
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter className="border-sidebar-border border-t">
          <NavUser
            user={{
              name: userProfile?.full_name || 'Usuario',
              email: userProfile?.email || '',
              avatar: userProfile?.avatar_url || '',
            }}
            labels={{
              upgrade: 'Mejorar a Pro',
              account: t.menu.account,
              billing: t.menu.billing,
              notifications: t.menu.notifications,
              logout: t.menu.logout,
            }}
            hrefs={{
              upgrade: `${localePrefix}/dashboard/subscription`,
              account: `${localePrefix}/dashboard/profile`,
              billing: `${localePrefix}/dashboard/subscription`,
            }}
            onLogout={logout}
          />
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>
      <SidebarInset className="bg-slate-50/40">
        <header className="flex h-16 shrink-0 items-center justify-between gap-2 border-b bg-white px-4 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-1 data-[orientation=vertical]:h-4"
            />
            <DashboardBreadcrumbs t={t} />
          </div>
          <div className="flex items-center gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="gap-1"
                >
                  <MessageSquarePlus className="size-4" />
                  {t.menu.giveFeedback}
                  <ChevronDown className="size-4" />
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
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 md:p-6">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  )
}
