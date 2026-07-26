"use client"

import { useState } from "react"
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import type { Doc } from "@/convex/_generated/dataModel";
import { ROLE_LABELS as roleLabels, ROLE_COLORS as roleColors } from "@/convex/schema";

const VIEW_ROLES = ["admin", "editor", "integrationshelfer"];

type Role = "admin" | "editor" | "viewer" | "integrationshelfer" | "gstc";

export default function UsersPage() {
  const currentUser = useQuery(api.users.getCurrentUser);
  const users = useQuery(api.users.list);
  const updateRole = useMutation(api.users.updateUserRole);
  const removeUser = useMutation(api.users.remove);
  const router = useRouter();

  const [deleteTarget, setDeleteTarget] = useState<Doc<"users"> | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [pendingRoleChange, setPendingRoleChange] = useState<{ user: Doc<"users">; newRole: Role } | null>(null);
  const [changingRole, setChangingRole] = useState(false);

  const canView = !!currentUser && VIEW_ROLES.includes(currentUser.role);
  const isAdmin = currentUser?.role === "admin";

  useEffect(() => {
    if (currentUser === null) return;
    if (currentUser && !canView) {
      router.replace("/dashboard");
    }
  }, [currentUser, canView, router]);

  if (!canView) {
    return null;
  }

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await removeUser({ userId: deleteTarget._id });
      setDeleteTarget(null);
    } finally {
      setDeleting(false);
    }
  };

  const handleRoleSelect = (user: Doc<"users">, newRole: Role) => {
    if (newRole === user.role) return;
    if (user.role === "admin") {
      setPendingRoleChange({ user, newRole });
      return;
    }
    updateRole({ userId: user._id, role: newRole });
  };

  const confirmRoleChange = async () => {
    if (!pendingRoleChange) return;
    setChangingRole(true);
    try {
      await updateRole({ userId: pendingRoleChange.user._id, role: pendingRoleChange.newRole });
      setPendingRoleChange(null);
    } finally {
      setChangingRole(false);
    }
  };

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold text-foreground">Nutzer</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Zugriffsrechte für das Dashboard verwalten.
      </p>

      <div className="mt-6 overflow-hidden rounded-lg border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Name</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">E-Mail</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Rolle</th>
              <th className="px-4 py-3 text-right font-medium text-muted-foreground sr-only">Aktionen</th>
            </tr>
          </thead>
          <tbody>
            {users?.map((user) => (
              <tr key={user._id} className="border-b last:border-0">
                <td className="px-4 py-3">{user.name || "—"}</td>
                <td className="px-4 py-3 text-muted-foreground">{user.email}</td>
                <td className="px-4 py-3">
                  {isAdmin ? (
                    <select
                      value={user.role}
                      onChange={(e) => handleRoleSelect(user, e.target.value as Role)}
                      className={`rounded-md border px-2 py-1 text-xs font-medium ${roleColors[user.role]}`}
                    >
                      {Object.entries(roleLabels).map(([value, label]) => (
                        <option key={value} value={value}>
                          {label}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <span className={`inline-flex rounded-md px-2 py-1 text-xs font-medium ${roleColors[user.role]}`}>
                      {roleLabels[user.role] ?? user.role}
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 text-right">
                  {isAdmin && user._id !== currentUser?._id && (
                    <button
                      type="button"
                      onClick={() => setDeleteTarget(user)}
                      className="text-muted-foreground hover:text-red-500 transition-colors"
                      aria-label={`${user.name || user.email} entfernen`}
                    >
                      <Trash2 className="size-4" />
                    </button>
                  )}
                </td>
              </tr>
            ))}
            {users?.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-muted-foreground">
                  Keine Nutzer gefunden.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Dialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nutzer entfernen</DialogTitle>
            <DialogDescription>
              {deleteTarget?.name || deleteTarget?.email} verliert den Dashboard-Zugriff. Bei erneuter Anmeldung wird die Person automatisch wieder als &quot;Wartet auf Freischaltung&quot; angelegt und muss erneut freigeschaltet werden.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteTarget(null)}>
              Abbrechen
            </Button>
            <Button variant="destructive" disabled={deleting} onClick={handleDelete}>
              Entfernen
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!pendingRoleChange} onOpenChange={(open) => !open && setPendingRoleChange(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Admin-Rolle ändern</DialogTitle>
            <DialogDescription>
              Du bist dabei, {pendingRoleChange?.user.name || pendingRoleChange?.user.email} von Admin zu &quot;{pendingRoleChange ? (roleLabels[pendingRoleChange.newRole] ?? pendingRoleChange.newRole) : ""}&quot; zu ändern. Bist du dir sicher?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPendingRoleChange(null)}>
              Abbrechen
            </Button>
            <Button variant="destructive" disabled={changingRole} onClick={confirmRoleChange}>
              Bestätigen
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
