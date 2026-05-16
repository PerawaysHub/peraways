"use client"

import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const roleLabels: Record<string, string> = {
  admin: "Admin",
  editor: "Editor",
  viewer: "Viewer",
};

const roleColors: Record<string, string> = {
  admin: "bg-red-100 text-red-800",
  editor: "bg-blue-100 text-blue-800",
  viewer: "bg-gray-100 text-gray-800",
};

export default function UsersPage() {
  const currentUser = useQuery(api.users.getCurrentUser);
  const users = useQuery(api.users.list);
  const updateRole = useMutation(api.users.updateUserRole);
  const router = useRouter();

  useEffect(() => {
    if (currentUser === null) return;
    if (currentUser && currentUser.role !== "admin") {
      router.replace("/dashboard");
    }
  }, [currentUser, router]);

  if (!currentUser || currentUser.role !== "admin") {
    return null;
  }

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold text-foreground">Users</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Manage dashboard access roles.
      </p>

      <div className="mt-6 overflow-hidden rounded-lg border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Name</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Email</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Role</th>
            </tr>
          </thead>
          <tbody>
            {users?.map((user) => (
              <tr key={user._id} className="border-b last:border-0">
                <td className="px-4 py-3">{user.name || "—"}</td>
                <td className="px-4 py-3 text-muted-foreground">{user.email}</td>
                <td className="px-4 py-3">
                  <select
                    defaultValue={user.role}
                    onChange={(e) => updateRole({ userId: user._id, role: e.target.value as "admin" | "editor" | "viewer" })}
                    className={`rounded-md border px-2 py-1 text-xs font-medium ${roleColors[user.role]}`}
                  >
                    {Object.entries(roleLabels).map(([value, label]) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
            {users?.length === 0 && (
              <tr>
                <td colSpan={3} className="px-4 py-8 text-center text-muted-foreground">
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
