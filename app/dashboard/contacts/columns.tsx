"use client"

import Link from "next/link"
import { useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import type { ColumnDef } from "@tanstack/react-table"
import type { Doc, Id } from "@/convex/_generated/dataModel"
import { Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { useState } from "react"

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

function DeleteContactDialog({ id }: { id: Id<"contacts"> }) {
  const remove = useMutation(api.contacts.remove)
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="text-muted-foreground hover:text-red-500 transition-colors"
      >
        <Trash2 className="size-4" />
      </button>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete contact</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this contact? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={() => {
              remove({ id })
              setOpen(false)
            }}
          >
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

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
      <a
        href={`mailto:${row.original.email}`}
        className="text-muted-foreground hover:text-primary transition-colors"
      >
        {row.original.email}
      </a>
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
  {
    id: "actions",
    header: () => <span className="sr-only">Actions</span>,
    cell: ({ row }) => <DeleteContactDialog id={row.original._id} />,
  },
]
