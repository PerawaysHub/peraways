"use client"

import { useEffect, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { UserButton } from "@clerk/nextjs"
import { useQuery, useMutation } from "convex/react"
import { toast, Toaster } from "sonner"
import { api } from "@/convex/_generated/api"
import {
  LayoutDashboard,
  MessageSquare,
  LayoutPanelTop,
  FileText,
  Users,
  Home,
  Bell,
} from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { ErrorBoundary } from "@/components/ErrorBoundary"

const sidebarLinks = [
  { href: "/dashboard", label: "Übersicht", icon: LayoutDashboard },
  { href: "/dashboard/contacts", label: "Einrichtungen", icon: MessageSquare },
  { href: "/dashboard/candidates", label: "Kandidaten", icon: LayoutPanelTop },
  { href: "/dashboard/documents", label: "Dokumente", icon: FileText },
]

function notificationLink(n: { type: string; relatedId?: string }) {
  if (n.type === "new_contact" && n.relatedId) return `/dashboard/contacts/${n.relatedId}`
  return null
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const currentUser = useQuery(api.users.getCurrentUser)
  const unread = useQuery(api.notifications.listUnread)
  const unreadCount = useQuery(api.notifications.countUnread)
  const markAllAsRead = useMutation(api.notifications.markAllAsRead)
  const markAsRead = useMutation(api.notifications.markAsRead)

  const seenIds = useRef<Set<string>>(new Set())

  useEffect(() => {
    if (!unread) return
    for (const n of unread) {
      if (seenIds.current.has(n._id)) continue
      seenIds.current.add(n._id)
      const link = notificationLink(n)
      toast(n.title, {
        description: n.description,
        action: link
          ? {
              label: "Ansehen",
              onClick: () => {
                markAsRead({ id: n._id })
                router.push(link)
              },
            }
          : undefined,
        cancel: {
          label: "Ok",
          onClick: () => {},
        },
      })
    }
  }, [unread, markAsRead, router])

  const links = currentUser?.role === "admin"
    ? [...sidebarLinks, { href: "/dashboard/users", label: "Nutzer", icon: Users }]
    : sidebarLinks

  return (
    <SidebarProvider className="flex h-screen w-full">
      <Toaster
        position="top-right"
        richColors
        closeButton
        offset={16}
      />
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:text-sm focus:font-semibold"
      >
        Zum Hauptinhalt springen
      </a>

      <Sidebar collapsible="icon">
        <SidebarHeader className="border-b border-sidebar-border">
          <Link
            href="/"
            aria-label="PeraWays home"
            className="flex items-center gap-2 px-4 py-3"
          >
            <Image
              src="/logo.svg"
              alt="PeraWays"
              width={28}
              height={28}
              className="hidden shrink-0 group-data-[collapsible=icon]:block"
            />
            <span className="font-heading text-xl font-bold text-primary group-data-[collapsible=icon]:hidden">
              PeraWays
            </span>
            <span
              className="text-xs text-muted-foreground group-data-[collapsible=icon]:hidden"
              aria-hidden="true"
            >
              CRM
            </span>
          </Link>
        </SidebarHeader>

        <SidebarContent>
          <SidebarMenu>
            {links.map((link) => {
              const Icon = link.icon
              return (
                <SidebarMenuItem key={link.href}>
                  <SidebarMenuButton
                    render={<Link href={link.href} />}
                    isActive={pathname === link.href || (link.href !== "/dashboard" && pathname.startsWith(link.href))}
                    tooltip={link.label}
                  >
                    <Icon aria-hidden="true" />
                    <span>{link.label}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )
            })}
          </SidebarMenu>
        </SidebarContent>

        <SidebarFooter className="border-t border-sidebar-border p-4">
          <Link
            href="/"
            className="flex items-center gap-2 text-xs text-muted-foreground hover:text-primary group-data-[collapsible=icon]:hidden"
          >
            <Home className="h-3 w-3" aria-hidden="true" />
            Zur Website
          </Link>
        </SidebarFooter>
      </Sidebar>

      <main id="main-content" className="flex min-w-0 flex-1 flex-col overflow-y-auto" tabIndex={-1}>
        <div className="flex items-center justify-between gap-2 border-b px-4 py-3">
          <SidebarTrigger />
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon-sm"
              className="relative"
              onClick={() => markAllAsRead()}
              aria-label={`${unreadCount ?? 0} unread notifications`}
            >
              <Bell className="h-4 w-4" aria-hidden="true" />
              {(unreadCount ?? 0) > 0 && (
                <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-medium text-white">
                  {unreadCount}
                </span>
              )}
            </Button>
            <UserButton />
          </div>
        </div>
        <div className="mx-auto w-full max-w-[1600px] flex-1 px-6 py-8">
          <ErrorBoundary>{children}</ErrorBoundary>
        </div>
      </main>
    </SidebarProvider>
  )
}
