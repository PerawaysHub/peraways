"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Loader2, User, Mail, Phone, MessageSquare, Globe } from "lucide-react";
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
  const id = params.id as Id<"contacts">;
  const contact = useQuery(api.contacts.getById, { id });

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

  return (
    <div className="space-y-6">
      <Link
        href="/dashboard/contacts"
        className="flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors w-fit"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to contacts
      </Link>

      <div>
        <h1 className="font-heading text-2xl font-bold text-primary">
          {contact.name}
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Submitted on {formatDate(contact._creationTime)}
        </p>
      </div>

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
    </div>
  );
}
