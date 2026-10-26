'use client'

import * as React from 'react'
import {
  ChevronsUpDown,
  CreditCard,
  LogOut,
  Sparkles,
  UserRound,
} from 'lucide-react'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar'
import Link from 'next/link'

function getInitials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (!parts.length) return 'U'
  if (parts.length === 1) return parts[0][0]?.toUpperCase() ?? 'U'
  return `${parts[0][0] ?? ''}${parts[1][0] ?? ''}`.toUpperCase()
}

function UserAvatar({
  user,
  initials,
}: {
  user: { name: string; avatar?: string }
  initials: string
}) {
  return (
    <Avatar className="ring-sidebar-border size-8 rounded-lg ring-1">
      {user.avatar ? <AvatarImage src={user.avatar} alt="" /> : null}
      <AvatarFallback className="bg-primary text-primary-foreground rounded-lg text-xs font-semibold">
        {initials}
      </AvatarFallback>
    </Avatar>
  )
}

function UserSummary({ user }: { user: { name: string; email: string } }) {
  return (
    <div className="grid min-w-0 flex-1 text-left text-sm leading-tight">
      <span className="truncate font-medium">{user.name}</span>
      {user.email ? (
        <span className="text-muted-foreground truncate text-xs">
          {user.email}
        </span>
      ) : null}
    </div>
  )
}

export function NavUser({
  user,
  labels,
  hrefs,
  onLogout,
}: {
  user: {
    name: string
    email: string
    avatar?: string
  }
  labels: {
    upgrade: string
    account: string
    billing: string
    /** Kept for API compatibility; notifications are not available yet. */
    notifications: string
    logout: string
  }
  hrefs: {
    upgrade?: string
    account: string
    billing: string
  }
  onLogout: () => void
}) {
  const { isMobile } = useSidebar()
  const [mounted, setMounted] = React.useState(false)
  const initials = getInitials(user.name)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  const triggerContent = (
    <>
      <UserAvatar user={user} initials={initials} />
      <UserSummary user={user} />
      <ChevronsUpDown
        className="text-muted-foreground ml-auto size-4"
        aria-hidden="true"
      />
    </>
  )

  if (!mounted) {
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton size="lg">
            {triggerContent}
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    )
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
             
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              {triggerContent}
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-60 rounded-xl"
            side={isMobile ? 'bottom' : 'right'}
            align="end"
            sideOffset={6}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2.5 px-2 py-2 text-left text-sm">
                <UserAvatar user={user} initials={initials} />
                <UserSummary user={user} />
              </div>
            </DropdownMenuLabel>
            {hrefs.upgrade ? (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem
                    asChild
                    className="text-primary focus:text-primary font-medium"
                  >
                    <Link href={hrefs.upgrade}>
                      <Sparkles className="text-primary" aria-hidden="true" />
                      {labels.upgrade}
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </>
            ) : null}
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem asChild>
                <Link href={hrefs.account}>
                  <UserRound aria-hidden="true" />
                  {labels.account}
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={hrefs.billing}>
                  <CreditCard aria-hidden="true" />
                  {labels.billing}
                </Link>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={onLogout} variant="destructive">
              <LogOut aria-hidden="true" />
              {labels.logout}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
