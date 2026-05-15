"use client"

import Link from "next/link"
import type { ColumnDef } from "@tanstack/react-table"
import type { Doc } from "@/convex/_generated/dataModel"

function formatDate(ts: number) {
  return new Date(ts).toLocaleDateString("de-DE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

export type Contact = Doc<"contacts">

export const columns: ColumnDef<Contact>[] = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => (
      <Link
        href={`/dashboard/contacts/${row.original._id}`}
        className="font-medium text-primary hover:underline"
      >
        {row.original.name}
      </Link>
    ),
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => (
      <span className="text-muted-foreground">{row.original.email}</span>
    ),
  },
  {
    accessorKey: "telefon",
    header: "Phone",
    cell: ({ row }) => (
      <span className="text-muted-foreground">
        {row.original.telefon || "—"}
      </span>
    ),
  },
  {
    accessorKey: "lang",
    header: "Language",
    cell: ({ row }) => (
      <span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
        {row.original.lang.toUpperCase()}
      </span>
    ),
  },
  {
    accessorKey: "_creationTime",
    header: "Date",
    sortingFn: "datetime",
    cell: ({ row }) => (
      <span className="text-muted-foreground">
        {formatDate(row.original._creationTime)}
      </span>
    ),
  },
]
