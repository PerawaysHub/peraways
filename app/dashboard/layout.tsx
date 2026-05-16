"use client"

import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { UserButton } from "@clerk/nextjs"
import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { LayoutDashboard, MessageSquare, LayoutPanelTop, FileText, Users, Home } from "lucide-react"
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
import { ErrorBoundary } from "@/components/ErrorBoundary"

const sidebarLinks = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/contacts", label: "Contacts", icon: MessageSquare },
  { href: "/dashboard/candidates", label: "Candidates", icon: LayoutPanelTop },
  { href: "/dashboard/documents", label: "Documents", icon: FileText },
]

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const currentUser = useQuery(api.users.getCurrentUser)

  const links = currentUser?.role === "admin"
    ? [...sidebarLinks, { href: "/dashboard/users", label: "Users", icon: Users }]
    : sidebarLinks

  return (
    <SidebarProvider className="flex h-screen w-full">
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
          <div className="flex items-center gap-3">
            <UserButton />
            <Link
              href="/"
              className="flex items-center gap-2 text-xs text-muted-foreground hover:text-primary group-data-[collapsible=icon]:hidden"
            >
              <Home className="h-3 w-3" aria-hidden="true" />
              Site
            </Link>
          </div>
        </SidebarFooter>
      </Sidebar>

      <main id="main-content" className="flex min-w-0 flex-1 flex-col overflow-y-auto" tabIndex={-1}>
        <div className="flex items-center gap-2 border-b px-4 py-3">
          <SidebarTrigger />
        </div>
        <div className="mx-auto w-full max-w-[1600px] flex-1 px-6 py-8">
          <ErrorBoundary>{children}</ErrorBoundary>
        </div>
      </main>
    </SidebarProvider>
  )
}
