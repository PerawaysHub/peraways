"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowLeft, Loader2, User, Mail, Phone, MessageSquare, Globe, Building2, Pencil, Trash2, X, Check, Contact, FileCheck2, Users, MapPin, CalendarPlus, Plus, Circle, CheckCircle2, PhoneCall, Handshake, MoreHorizontal, Lock } from "lucide-react";
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
import { CONTACT_STATUSES, CONTACT_TERMIN_ARTEN } from "@/convex/schema";
import type { Id } from "@/convex/_generated/dataModel";
import { terminUrgency } from "@/lib/utils";

const CONTACT_ART_ICONS: Record<string, React.ElementType> = {
  "Rückruf": PhoneCall,
  Treffen: Handshake,
  Sonstiges: MoreHorizontal,
};

function formatDateOnly(ts: number) {
  return new Date(ts).toLocaleDateString("de-DE");
}

const TALENT_STATUS_COLORS: Record<string, string> = {
  Qualifizierung: "bg-violet-50 text-violet-700 border-violet-200",
  "LEA-Fast-Lane": "bg-blue-50 text-blue-700 border-blue-200",
  Visum: "bg-amber-50 text-amber-700 border-amber-200",
  "Onboarding / Berlin-Phase": "bg-orange-50 text-orange-700 border-orange-200",
  Abgeschlossen: "bg-primary/10 text-primary border-primary/20",
};

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
        <p className="text-sm font-medium text-foreground whitespace-pre-line">{value}</p>
      </div>
    </div>
  );
}

export default function ContactDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as Id<"contacts">;
  const contact = useQuery(api.contacts.getById, { id });
  const linkedCandidates = useQuery(api.candidates.listByEinrichtung, { einrichtungId: id });
  const termine = useQuery(api.termine.listByContact, { contactId: id });
  const unread = useQuery(api.notifications.listUnread);
  const currentUser = useQuery(api.users.getCurrentUser);
  const updateContact = useMutation(api.contacts.update);
  const updateStatus = useMutation(api.contacts.updateStatus);
  const deleteContact = useMutation(api.contacts.remove);
  const markAsRead = useMutation(api.notifications.markAsRead);
  const updateNotizen = useMutation(api.contacts.updateNotizen);
  const createTermin = useMutation(api.termine.create);
  const updateTerminStatus = useMutation(api.termine.updateStatus);
  const removeTermin = useMutation(api.termine.remove);
  const updateTermin = useMutation(api.termine.update);
  const isAdmin = currentUser?.role === "admin";

  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [notizenDraft, setNotizenDraft] = useState("");
  const [savingNotizen, setSavingNotizen] = useState(false);
  const [terminDraft, setTerminDraft] = useState({
    datum: "",
    uhrzeit: "",
    art: "Rückruf" as (typeof CONTACT_TERMIN_ARTEN)[number],
    notizen: "",
    visibility: "alle" as "alle" | "nur_ich",
  });
  const [addingTermin, setAddingTermin] = useState(false);
  const hasScrolledToTermine = useRef(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    telefon: "",
    einrichtung: "",
    nachricht: "",
    lang: "",
    ansprechpartnerName: "",
    ansprechpartnerEmail: "",
    ansprechpartnerTelefon: "",
    rahmenvertragUnterschrieben: false,
    adresse: "",
  });

  useEffect(() => {
    if (!unread) return;
    const matching = unread.filter((n) => n.type === "new_contact" && n.relatedId === id);
    for (const n of matching) markAsRead({ id: n._id });
  }, [unread, id, markAsRead]);

  useEffect(() => {
    if (contact && !hasScrolledToTermine.current && window.location.hash === "#termine-section") {
      hasScrolledToTermine.current = true;
      document.getElementById("termine-section")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [contact]);

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
        <p className="mt-4 text-sm font-medium text-muted-foreground">Einrichtung nicht gefunden</p>
        <Link
          href="/dashboard/contacts"
          className="mt-2 text-sm text-primary hover:underline"
        >
          Zurück zu Einrichtungen
        </Link>
      </div>
    );
  }

  const startEditing = () => {
    setForm({
      name: contact.name,
      email: contact.email,
      telefon: contact.telefon ?? "",
      einrichtung: contact.einrichtung ?? "",
      nachricht: contact.nachricht,
      lang: contact.lang,
      ansprechpartnerName: contact.ansprechpartnerName ?? "",
      ansprechpartnerEmail: contact.ansprechpartnerEmail ?? "",
      ansprechpartnerTelefon: contact.ansprechpartnerTelefon ?? "",
      rahmenvertragUnterschrieben: contact.rahmenvertragUnterschrieben ?? false,
      adresse: contact.adresse ?? "",
    });
    setEditing(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateContact({
        id,
        ...form,
        telefon: form.telefon || undefined,
        einrichtung: form.einrichtung || undefined,
        ansprechpartnerName: form.ansprechpartnerName || undefined,
        ansprechpartnerEmail: form.ansprechpartnerEmail || undefined,
        ansprechpartnerTelefon: form.ansprechpartnerTelefon || undefined,
        adresse: form.adresse || undefined,
      });
      setEditing(false);
    } finally {
      setSaving(false);
    }
  };

  const handleSaveNotizen = async () => {
    setSavingNotizen(true);
    try {
      await updateNotizen({ id, notizen: notizenDraft || contact.notizen || "" });
    } finally {
      setSavingNotizen(false);
    }
  };

  const handleAddTermin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!terminDraft.datum || !terminDraft.uhrzeit) return;
    setAddingTermin(true);
    try {
      await createTermin({
        contactId: id,
        datum: new Date(terminDraft.datum).getTime(),
        uhrzeit: terminDraft.uhrzeit,
        art: terminDraft.art,
        notizen: terminDraft.notizen || undefined,
        visibility: terminDraft.visibility,
      });
      setTerminDraft({ datum: "", uhrzeit: "", art: "Rückruf", notizen: "", visibility: "alle" });
    } finally {
      setAddingTermin(false);
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

  const status = contact.status ?? "Neue Anfrage";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Link
          href="/dashboard/contacts"
          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors w-fit"
        >
          <ArrowLeft className="h-4 w-4" />
          Zurück zu Einrichtungen
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
                Abbrechen
              </Button>
              <Button
                size="sm"
                onClick={handleSave}
                disabled={saving}
                className="gap-1.5"
              >
                {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Check className="h-3.5 w-3.5" />}
                Speichern
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" size="sm" onClick={startEditing} className="gap-1.5">
                <Pencil className="h-3.5 w-3.5" />
                Bearbeiten
              </Button>
              <Button variant="destructive" size="sm" onClick={() => setDeleteOpen(true)} className="gap-1.5">
                <Trash2 className="h-3.5 w-3.5" />
                Löschen
              </Button>
            </>
          )}
        </div>
      </div>

      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-bold text-primary">
            {contact.einrichtung || contact.name}
          </h1>
          {contact.einrichtung && (
            <p className="text-sm text-muted-foreground mt-0.5">{contact.name}</p>
          )}
          <p className="text-sm text-muted-foreground mt-1">
            Eingegangen am {formatDate(contact._creationTime)}
          </p>
        </div>

        <div className="shrink-0">
          <label className="text-xs font-medium text-muted-foreground block mb-1 text-right">Status</label>
          <select
            value={status}
            onChange={(e) => updateStatus({ id, status: e.target.value, position: 0 })}
            className="flex h-9 rounded-md border border-input bg-white px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            {CONTACT_STATUSES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>

      {editing ? (
        <div className="rounded-xl border bg-white p-6 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">Name</label>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">Einrichtung</label>
              <Input value={form.einrichtung} onChange={(e) => setForm({ ...form, einrichtung: e.target.value })} />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">E-Mail</label>
              <Input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">Telefon</label>
              <Input value={form.telefon} onChange={(e) => setForm({ ...form, telefon: e.target.value })} />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">Sprache</label>
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
            <label className="text-xs font-medium text-muted-foreground">Adresse</label>
            <Textarea
              value={form.adresse}
              onChange={(e) => setForm({ ...form, adresse: e.target.value })}
              placeholder={"Straße & Hausnummer\nPLZ Ort"}
              rows={2}
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">Nachricht</label>
            <Textarea
              value={form.nachricht}
              onChange={(e) => setForm({ ...form, nachricht: e.target.value })}
              rows={5}
            />
          </div>
          <div className="border-t pt-4 space-y-4">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Ansprechpartner / Heimleitung</p>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">Name</label>
                <Input value={form.ansprechpartnerName} onChange={(e) => setForm({ ...form, ansprechpartnerName: e.target.value })} />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">E-Mail</label>
                <Input value={form.ansprechpartnerEmail} onChange={(e) => setForm({ ...form, ansprechpartnerEmail: e.target.value })} />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">Telefon</label>
                <Input value={form.ansprechpartnerTelefon} onChange={(e) => setForm({ ...form, ansprechpartnerTelefon: e.target.value })} />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">Rahmenvertrag unterschrieben</label>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    size="sm"
                    variant={form.rahmenvertragUnterschrieben ? "default" : "outline"}
                    onClick={() => setForm({ ...form, rahmenvertragUnterschrieben: true })}
                  >
                    Ja
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant={!form.rahmenvertragUnterschrieben ? "default" : "outline"}
                    onClick={() => setForm({ ...form, rahmenvertragUnterschrieben: false })}
                  >
                    Nein
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="grid gap-4 rounded-xl border bg-white p-6 sm:grid-cols-2">
            <DetailRow icon={User} label="Name" value={contact.name} />
            <DetailRow icon={Building2} label="Einrichtung" value={contact.einrichtung || "—"} />
            <DetailRow icon={Mail} label="E-Mail" value={contact.email} />
            <DetailRow icon={Phone} label="Telefon" value={contact.telefon || "—"} />
            <DetailRow icon={Globe} label="Sprache" value={contact.lang.toUpperCase()} />
            <DetailRow icon={MapPin} label="Adresse" value={contact.adresse || "—"} />
          </div>

          <div className="rounded-xl border bg-white p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Contact className="h-4 w-4 text-primary" />
                <h2 className="text-sm font-semibold text-foreground">Ansprechpartner / Heimleitung</h2>
              </div>
              <span
                className={`inline-flex items-center gap-1 rounded-md border px-2 py-1 text-[11px] font-semibold ${
                  contact.rahmenvertragUnterschrieben
                    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                    : "bg-gray-50 text-gray-500 border-gray-200"
                }`}
              >
                <FileCheck2 className="h-3.5 w-3.5" />
                Rahmenvertrag: {contact.rahmenvertragUnterschrieben ? "Ja" : "Nein"}
              </span>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <DetailRow icon={User} label="Name" value={contact.ansprechpartnerName || "—"} />
              <DetailRow icon={Mail} label="E-Mail" value={contact.ansprechpartnerEmail || "—"} />
              <DetailRow icon={Phone} label="Telefon" value={contact.ansprechpartnerTelefon || "—"} />
            </div>
          </div>

          <div className="rounded-xl border bg-white p-6">
            <div className="flex items-center gap-2 mb-3">
              <MessageSquare className="h-4 w-4 text-primary" />
              <h2 className="text-sm font-semibold text-foreground">Nachricht</h2>
            </div>
            <p className="whitespace-pre-wrap text-sm text-muted-foreground leading-relaxed">
              {contact.nachricht || "—"}
            </p>
          </div>

          <div className="rounded-xl border bg-white p-6">
            <div className="flex items-center gap-2 mb-3">
              <MessageSquare className="h-4 w-4 text-primary" />
              <h2 className="text-sm font-semibold text-foreground">Notizen</h2>
            </div>
            <Textarea
              placeholder="Notizen zu dieser Einrichtung hinzufügen..."
              value={notizenDraft || contact.notizen || ""}
              onChange={(e) => setNotizenDraft(e.target.value)}
              rows={5}
              className="mb-3 border-gray-200 bg-gray-50/50 text-sm focus-visible:border-primary/30 focus-visible:ring-[1.5px] focus-visible:ring-primary/15"
            />
            <Button
              onClick={handleSaveNotizen}
              disabled={savingNotizen || notizenDraft === (contact.notizen ?? "")}
              size="sm"
              className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm text-xs h-8"
            >
              {savingNotizen && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
              Notizen speichern
            </Button>
          </div>

          <div id="termine-section" className="rounded-xl border bg-white p-6">
            <div className="flex items-center gap-2 mb-4">
              <CalendarPlus className="h-4 w-4 text-primary" />
              <h2 className="text-sm font-semibold text-foreground">Termine</h2>
            </div>

            <form onSubmit={handleAddTermin} className="flex flex-wrap items-end gap-2 mb-4">
              <input
                type="date"
                value={terminDraft.datum}
                onChange={(e) => setTerminDraft((d) => ({ ...d, datum: e.target.value }))}
                required
                className="h-8 rounded-lg border border-gray-200 bg-gray-50/80 px-2 text-xs text-gray-600 focus:outline-none focus:border-primary/30 focus:ring-[1.5px] focus:ring-primary/15"
              />
              <input
                type="time"
                value={terminDraft.uhrzeit}
                onChange={(e) => setTerminDraft((d) => ({ ...d, uhrzeit: e.target.value }))}
                required
                className="h-8 rounded-lg border border-gray-200 bg-gray-50/80 px-2 text-xs text-gray-600 focus:outline-none focus:border-primary/30 focus:ring-[1.5px] focus:ring-primary/15"
              />
              <select
                value={terminDraft.art}
                onChange={(e) => setTerminDraft((d) => ({ ...d, art: e.target.value as (typeof CONTACT_TERMIN_ARTEN)[number] }))}
                className="h-8 rounded-lg border border-gray-200 bg-gray-50/80 px-2 text-xs font-medium text-gray-600 focus:outline-none focus:border-primary/30 focus:ring-[1.5px] focus:ring-primary/15"
              >
                {CONTACT_TERMIN_ARTEN.map((a) => (
                  <option key={a} value={a}>{a}</option>
                ))}
              </select>
              <input
                type="text"
                placeholder="Notizen (optional)"
                value={terminDraft.notizen}
                onChange={(e) => setTerminDraft((d) => ({ ...d, notizen: e.target.value }))}
                className="h-8 min-w-[140px] flex-1 rounded-lg border border-gray-200 bg-gray-50/80 px-2 text-xs text-gray-600 focus:outline-none focus:border-primary/30 focus:ring-[1.5px] focus:ring-primary/15"
              />
              {isAdmin && (
                <select
                  value={terminDraft.visibility}
                  onChange={(e) => setTerminDraft((d) => ({ ...d, visibility: e.target.value as "alle" | "nur_ich" }))}
                  className="h-8 rounded-lg border border-gray-200 bg-gray-50/80 px-2 text-xs font-medium text-gray-600 focus:outline-none focus:border-primary/30 focus:ring-[1.5px] focus:ring-primary/15"
                >
                  <option value="alle">Sichtbar: Alle</option>
                  <option value="nur_ich">Sichtbar: Nur ich</option>
                </select>
              )}
              <Button
                type="submit"
                size="sm"
                disabled={addingTermin}
                className="text-xs gap-1.5 h-8 bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm"
              >
                {addingTermin ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Plus className="h-3.5 w-3.5" />}
                Hinzufügen
              </Button>
            </form>

            {termine === undefined ? (
              <div className="h-8 flex items-center">
                <Loader2 className="h-3.5 w-3.5 animate-spin text-gray-400" />
              </div>
            ) : termine.length > 0 ? (
              <div className="divide-y divide-gray-100">
                {[...termine].sort((a, b) => a.datum - b.datum).map((termin) => {
                  const ArtIcon = CONTACT_ART_ICONS[termin.art] ?? MoreHorizontal;
                  const urgency = terminUrgency(termin.datum, termin.status);
                  const urgencyBorder =
                    urgency === "ueberfaellig"
                      ? "border-red-400"
                      : urgency === "bald"
                        ? "border-amber-400"
                        : "border-transparent";
                  return (
                    <div key={termin._id} className={`flex items-center justify-between gap-3 py-2.5 border-l-2 pl-2.5 ${urgencyBorder}`}>
                      <div className="flex items-center gap-2.5 min-w-0">
                        <ArtIcon className="h-4 w-4 text-gray-400 shrink-0" />
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {formatDateOnly(termin.datum)} · {termin.uhrzeit} · {termin.art}
                            </p>
                            {termin.visibility === "nur_ich" && (
                              <span className="flex items-center gap-1 text-[10px] font-semibold text-amber-700 bg-amber-50 border border-amber-200 rounded px-1.5 py-0.5 shrink-0">
                                <Lock className="h-2.5 w-2.5" />
                                Nur ich
                              </span>
                            )}
                          </div>
                          {termin.notizen && (
                            <p className="text-[11px] text-gray-400 truncate">{termin.notizen}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        {isAdmin && (
                          <button
                            type="button"
                            onClick={() =>
                              updateTermin({
                                id: termin._id,
                                visibility: termin.visibility === "nur_ich" ? "alle" : "nur_ich",
                              })
                            }
                            title={termin.visibility === "nur_ich" ? "Für alle sichtbar machen" : "Nur für mich sichtbar machen"}
                            className="flex items-center justify-center h-7 w-7 text-gray-300 hover:text-primary transition-colors"
                          >
                            {termin.visibility === "nur_ich" ? <Lock className="h-3.5 w-3.5" /> : <Users className="h-3.5 w-3.5" />}
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() =>
                            updateTerminStatus({
                              id: termin._id,
                              status: termin.status === "Offen" ? "Erledigt" : "Offen",
                            })
                          }
                          className={`flex items-center gap-1.5 border px-2 py-1 text-[11px] font-semibold transition-all ${
                            termin.status === "Erledigt"
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                              : "bg-gray-50 text-gray-500 border-gray-200"
                          }`}
                        >
                          {termin.status === "Erledigt" ? (
                            <CheckCircle2 className="h-3.5 w-3.5" />
                          ) : (
                            <Circle className="h-3.5 w-3.5" />
                          )}
                          {termin.status}
                        </button>
                        <button
                          type="button"
                          onClick={() => removeTermin({ id: termin._id })}
                          className="flex items-center justify-center h-7 w-7 text-gray-300 hover:text-red-500 transition-colors"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-xs text-gray-400 py-2">Noch keine Termine.</p>
            )}
          </div>

          <div className="rounded-xl border bg-white p-6">
            <div className="flex items-center gap-2 mb-3">
              <Users className="h-4 w-4 text-primary" />
              <h2 className="text-sm font-semibold text-foreground">Verknüpfte Talente</h2>
            </div>
            {linkedCandidates === undefined ? (
              <div className="h-8 flex items-center">
                <Loader2 className="h-3.5 w-3.5 animate-spin text-muted-foreground" />
              </div>
            ) : linkedCandidates.length > 0 ? (
              <div className="divide-y divide-gray-100">
                {linkedCandidates.map((c) => (
                  <Link
                    key={c._id}
                    href={`/dashboard/candidates/${c._id}`}
                    className="flex items-center justify-between py-2.5 group"
                  >
                    <span className="text-sm font-medium text-gray-900 group-hover:text-primary transition-colors">
                      {c.name}
                    </span>
                    <span className={`inline-flex items-center border px-2 py-1 text-[11px] font-semibold ${TALENT_STATUS_COLORS[c.status] ?? "bg-gray-50 text-gray-500 border-gray-200"}`}>
                      {c.status}
                    </span>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Noch keine Talente zugeordnet.</p>
            )}
          </div>
        </>
      )}

      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Einrichtung in den Papierkorb verschieben?</DialogTitle>
            <DialogDescription>
              Der Eintrag wird in den Papierkorb verschoben. Du kannst ihn dort jederzeit wiederherstellen oder endgültig löschen.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteOpen(false)}>
              Abbrechen
            </Button>
            <Button
              variant="destructive"
              disabled={deleting}
              onClick={handleDelete}
            >
              {deleting && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
              In den Papierkorb
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
