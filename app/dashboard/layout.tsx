import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import { MessageSquare, LayoutDashboard, Home, LayoutPanelTop, FileText } from "lucide-react";

const sidebarLinks = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/contacts", label: "Contacts", icon: MessageSquare },
  { href: "/dashboard/candidates", label: "Candidates", icon: LayoutPanelTop },
  { href: "/dashboard/documents", label: "Documents", icon: FileText },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <aside className="flex w-64 flex-col border-r border-gray-200 bg-white">
        <div className="flex h-16 items-center gap-2 border-b border-gray-200 px-6">
          <Link href="/" className="font-heading text-xl font-bold text-primary">
            PeraWays
          </Link>
          <span className="text-xs text-muted-foreground">CRM</span>
        </div>

        <nav className="flex-1 space-y-1 p-4">
          {sidebarLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-primary/5 hover:text-primary"
              >
                <Icon className="h-4 w-4" />
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3 border-t border-gray-200 p-4">
          <UserButton />
          <Link href="/" className="flex items-center gap-2 text-xs text-muted-foreground hover:text-primary">
            <Home className="h-3 w-3" />
            Site
          </Link>
        </div>
      </aside>

      <main className="flex-1 overflow-auto">
        <div className="mx-auto max-w-[1600px] px-6 py-8">
          {children}
        </div>
      </main>
    </div>
  );
}
