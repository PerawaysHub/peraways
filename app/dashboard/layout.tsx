"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { UserButton } from "@clerk/nextjs"
import { useQuery, useMutation } from "convex/react"
import { toast, Toaster } from "sonner"
import { api } from "@/convex/_generated/api"
import { ROLE_LABELS, ROLE_COLORS } from "@/convex/schema"
import {
  LayoutDashboard,
  MessageSquare,
  LayoutPanelTop,
  FileText,
  Users,
  Home,
  Bell,
  BellPlus,
  CalendarCheck2,
  Mail,
  Trash2,
  BookOpen,
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
  useSidebar,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { ErrorBoundary } from "@/components/ErrorBoundary"
import { useLanguage } from "@/components/LanguageContext"

const sidebarLinks = [
  { href: "/dashboard", label: "Übersicht", icon: LayoutDashboard },
  { href: "/dashboard/contacts", label: "Einrichtungen", icon: MessageSquare },
  { href: "/dashboard/candidates", label: "Talente", icon: LayoutPanelTop },
  { href: "/dashboard/heute", label: "Heute", icon: CalendarCheck2 },
  { href: "/dashboard/documents", label: "Dokumente", icon: FileText },
  { href: "/dashboard/handbuch", label: "Handbuch", icon: BookOpen },
  { href: "/dashboard/trash", label: "Papierkorb", icon: Trash2 },
]

const SIDEBAR_LABELS_EN: Record<string, string> = {
  "Übersicht": "Overview",
  Einrichtungen: "Facilities",
  Talente: "Talents",
  Heute: "Today",
  Dokumente: "Documents",
  Handbuch: "Handbook",
  Papierkorb: "Trash",
  Nutzer: "Users",
}

function SidebarNavLink({
  link,
  isActive,
}: {
  link: { href: string; label: string; icon: React.ElementType }
  isActive: boolean
}) {
  const { setOpenMobile } = useSidebar()
  const { lang } = useLanguage()
  const label = lang === "en" ? (SIDEBAR_LABELS_EN[link.label] ?? link.label) : link.label
  const Icon = link.icon
  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        render={<Link href={link.href} onClick={() => setOpenMobile(false)} />}
        isActive={isActive}
        tooltip={label}
      >
        <Icon aria-hidden="true" />
        <span>{label}</span>
      </SidebarMenuButton>
    </SidebarMenuItem>
  )
}

function notificationLink(n: { type: string; relatedId?: string }) {
  if (n.type === "new_contact" && n.relatedId) return `/dashboard/contacts/${n.relatedId}`
  if (n.type === "new_user_registered") return "/dashboard/users"
  return null
}

function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/")
  const rawData = atob(base64)
  const outputArray = new Uint8Array(rawData.length)
  for (let i = 0; i < rawData.length; i++) {
    outputArray[i] = rawData.charCodeAt(i)
  }
  return outputArray
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const currentUser = useQuery(api.users.getCurrentUser)
  const role = currentUser?.role
  const { lang, setLang } = useLanguage()
  const canSeeNotifications = !!role && role !== "gstc" && role !== "viewer"
  const unread = useQuery(api.notifications.listUnread, canSeeNotifications ? {} : "skip")
  const unreadCount = useQuery(api.notifications.countUnread, canSeeNotifications ? {} : "skip")
  const markAllAsRead = useMutation(api.notifications.markAllAsRead)
  const markAsRead = useMutation(api.notifications.markAsRead)
  const subscribePush = useMutation(api.push.subscribe)

  const seenIds = useRef<Set<string>>(new Set())
  const [notifPermission, setNotifPermission] = useState<NotificationPermission | null>(null)
  const [pushSubscribed, setPushSubscribed] = useState<boolean | null>(null)

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {})
    }
    if (typeof window !== "undefined" && "Notification" in window) {
      // Reading a browser-only global; must happen post-mount to avoid an
      // SSR/hydration mismatch (server never knows Notification.permission).
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setNotifPermission(Notification.permission)
    }
  }, [])

  useEffect(() => {
    if (!canSeeNotifications) return
    if (!("serviceWorker" in navigator) || !("PushManager" in window)) return
    navigator.serviceWorker.ready.then(async (reg) => {
      const sub = await reg.pushManager.getSubscription()
      setPushSubscribed(!!sub)
    })
  }, [canSeeNotifications])

  const handleEnablePush = async () => {
    if (!("serviceWorker" in navigator) || !("PushManager" in window)) return
    const vapidKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY
    if (!vapidKey) return
    const permission = await Notification.requestPermission()
    setNotifPermission(permission)
    if (permission !== "granted") return
    const reg = await navigator.serviceWorker.ready
    const sub = await reg.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(vapidKey),
    })
    const json = sub.toJSON()
    await subscribePush({
      endpoint: sub.endpoint,
      p256dh: json.keys?.p256dh ?? "",
      auth: json.keys?.auth ?? "",
    })
    setPushSubscribed(true)
  }

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

  useEffect(() => {
    if (!role) return
    if (role === "gstc") {
      if (!pathname.startsWith("/dashboard/candidates") && !pathname.startsWith("/dashboard/handbuch")) {
        router.replace("/dashboard/candidates")
      }
      return
    }
    if (role === "viewer") {
      if (!pathname.startsWith("/dashboard/pending")) router.replace("/dashboard/pending")
      return
    }
    // Any other (real) role stranded on the pending screen — e.g. just got
    // promoted — should leave it automatically.
    if (pathname.startsWith("/dashboard/pending")) router.replace("/dashboard")
  }, [role, pathname, router])

  const VIEW_USERS_ROLES = ["admin", "editor", "integrationshelfer"]
  const links = role === "viewer"
    ? []
    : role === "gstc"
      ? sidebarLinks.filter((l) => l.href === "/dashboard/candidates" || l.href === "/dashboard/handbuch")
      : VIEW_USERS_ROLES.includes(role ?? "")
        ? [...sidebarLinks, { href: "/dashboard/users", label: "Nutzer", icon: Users }]
        : sidebarLinks

  return (
    <SidebarProvider className="dashboard-shell flex h-screen w-full">
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
            href="/dashboard"
            aria-label="PeraWays Übersicht"
            className="flex items-center gap-2 px-4 py-3"
          >
            <Image
              src="/logo.svg"
              alt="PeraWays"
              width={28}
              height={28}
              className="hidden shrink-0 group-data-[collapsible=icon]:block"
            />
            <span className="text-xl group-data-[collapsible=icon]:hidden">
              <span style={{ fontFamily: "var(--font-logo-pera)", fontWeight: 700 }} className="text-primary">Pera</span>
              <span style={{ fontFamily: "var(--font-logo-ways)", fontWeight: 800 }} className="text-accent">Ways</span>
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
            {links.map((link) => (
              <SidebarNavLink
                key={link.href}
                link={link}
                isActive={pathname === link.href || (link.href !== "/dashboard" && pathname.startsWith(link.href))}
              />
            ))}
          </SidebarMenu>
        </SidebarContent>

        <SidebarFooter className="border-t border-sidebar-border p-4 space-y-2">
          <a
            href="https://mail.google.com/mail/u/0/#inbox"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-xs text-muted-foreground hover:text-primary group-data-[collapsible=icon]:hidden"
          >
            <Mail className="h-3 w-3" aria-hidden="true" />
            Gmail-Postfach
          </a>
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
            {canSeeNotifications && pushSubscribed === false && notifPermission && notifPermission !== "denied" && (
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={handleEnablePush}
                aria-label="Push-Benachrichtigungen aktivieren"
                title="Push-Benachrichtigungen aktivieren"
              >
                <BellPlus className="h-4 w-4" aria-hidden="true" />
              </Button>
            )}
            {canSeeNotifications && (
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
            )}
            {role && (
              <span className={`hidden sm:inline-flex items-center rounded-md px-2 py-1 text-[11px] font-medium ${ROLE_COLORS[role] ?? "bg-gray-100 text-gray-800"}`}>
                {ROLE_LABELS[role] ?? role}
              </span>
            )}
            <button
              type="button"
              onClick={() => setLang(lang === "de" ? "en" : "de")}
              className="rounded-md border border-gray-200 px-2 py-1 text-[11px] font-semibold text-gray-500 hover:border-gray-300 hover:text-gray-700 transition-colors"
              aria-label="Sprache wechseln / Switch language"
              title="Sprache wechseln / Switch language"
            >
              {lang === "de" ? "DE" : "EN"}
            </button>
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
