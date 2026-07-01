"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, Loader2, User, Mail, Phone, MessageSquare, Globe, Pencil, Trash2, X, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import type { Id } from "@/convex/_generated/dataModel";

function formatDate(ts: number) {
  return new Date(ts).toLocaleDateString("de-DE", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function DetailRow({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-lg bg-primary/5 text-primary">
        <Icon className="h-4 w-4" />
      </div>
      <div>
        <p className="text-xs font-medium text-muted-foreground">{label}</p>
        <p className="text-sm font-medium text-foreground">{value}</p>
      </div>
    </div>
  );
}

export default function ContactDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as Id<"contacts">;
  const contact = useQuery(api.contacts.getById, { id });
  const updateContact = useMutation(api.contacts.update);
  const deleteContact = useMutation(api.contacts.remove);

  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", telefon: "", nachricht: "", lang: "" });

  if (contact === undefined) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (contact === null) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <MessageSquare className="h-10 w-10 text-muted-foreground/40" />
        <p className="mt-4 text-sm font-medium text-muted-foreground">Contact not found</p>
        <Link
          href="/dashboard/contacts"
          className="mt-2 text-sm text-primary hover:underline"
        >
          Back to contacts
        </Link>
      </div>
    );
  }

  const startEditing = () => {
    setForm({
      name: contact.name,
      email: contact.email,
      telefon: contact.telefon ?? "",
      nachricht: contact.nachricht,
      lang: contact.lang,
    });
    setEditing(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateContact({ id, ...form, telefon: form.telefon || undefined });
      setEditing(false);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await deleteContact({ id });
      router.push("/dashboard/contacts");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Link
          href="/dashboard/contacts"
          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors w-fit"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to contacts
        </Link>

        <div className="flex items-center gap-2">
          {editing ? (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setEditing(false)}
                disabled={saving}
                className="gap-1.5"
              >
                <X className="h-3.5 w-3.5" />
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleSave}
                disabled={saving}
                className="gap-1.5"
              >
                {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Check className="h-3.5 w-3.5" />}
                Save
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" size="sm" onClick={startEditing} className="gap-1.5">
                <Pencil className="h-3.5 w-3.5" />
                Edit
              </Button>
              <Button variant="destructive" size="sm" onClick={() => setDeleteOpen(true)} className="gap-1.5">
                <Trash2 className="h-3.5 w-3.5" />
                Delete
              </Button>
            </>
          )}
        </div>
      </div>

      <div>
        <h1 className="font-heading text-2xl font-bold text-primary">
          {contact.name}
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Submitted on {formatDate(contact._creationTime)}
        </p>
      </div>

      {editing ? (
        <div className="rounded-xl border bg-white p-6 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">Name</label>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">Email</label>
              <Input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">Phone</label>
              <Input value={form.telefon} onChange={(e) => setForm({ ...form, telefon: e.target.value })} />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">Language</label>
              <select
                value={form.lang}
                onChange={(e) => setForm({ ...form, lang: e.target.value })}
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              >
                <option value="de">DE</option>
                <option value="en">EN</option>
              </select>
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">Message</label>
            <Textarea
              value={form.nachricht}
              onChange={(e) => setForm({ ...form, nachricht: e.target.value })}
              rows={5}
            />
          </div>
        </div>
      ) : (
        <>
          <div className="grid gap-4 rounded-xl border bg-white p-6 sm:grid-cols-2">
            <DetailRow icon={User} label="Name" value={contact.name} />
            <DetailRow icon={Mail} label="Email" value={contact.email} />
            <DetailRow icon={Phone} label="Phone" value={contact.telefon || "—"} />
            <DetailRow icon={Globe} label="Language" value={contact.lang.toUpperCase()} />
          </div>

          <div className="rounded-xl border bg-white p-6">
            <div className="flex items-center gap-2 mb-3">
              <MessageSquare className="h-4 w-4 text-primary" />
              <h2 className="text-sm font-semibold text-foreground">Message</h2>
            </div>
            <p className="whitespace-pre-wrap text-sm text-muted-foreground leading-relaxed">
              {contact.nachricht}
            </p>
          </div>
        </>
      )}

      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete contact</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this contact? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              disabled={deleting}
              onClick={handleDelete}
            >
              {deleting && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
