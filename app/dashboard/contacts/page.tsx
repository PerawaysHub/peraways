"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { DataTable } from "@/components/data-table";
import { columns } from "./columns";
import Link from "next/link";
import { MessageSquare, ArrowLeft } from "lucide-react";

export default function ContactsPage() {
  const contacts = useQuery(api.contacts.list);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href="/dashboard"
          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors"
        >
          <ArrowLeft className="size-4" />
          Dashboard
        </Link>
      </div>

      <div>
        <h1 className="font-heading text-2xl font-bold text-primary flex items-center gap-2">
          <MessageSquare className="size-6" />
          Contacts
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          All contact form submissions
        </p>
      </div>

      <DataTable
        columns={columns}
        data={contacts}
        filterColumn="name"
        filterPlaceholder="Filter by name..."
      />
    </div>
  );
}
