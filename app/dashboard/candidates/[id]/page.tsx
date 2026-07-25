"use client"

import { useQuery, useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Loader2, User, Mail, Phone, MessageSquare, Globe, Tag, FileText, ChevronDown, Upload, Download, Trash2, Clock, Plus, ArrowRightCircle, FileUp, Activity, Cake, CreditCard, MapPin, GraduationCap, Plane, CalendarClock, Briefcase, ShieldCheck, CheckCircle2, Circle, Paperclip, CalendarPlus, Stamp, Landmark, Building2, MoreHorizontal, Camera, Euro, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { CANDIDATE_STATUSES, TERMIN_ARTEN, HONORARBETRAG_OPTIONS, FINANZEN_STATUSES } from "@/convex/schema"
import { useRef, useState, useCallback, useEffect } from "react"
import type { Id } from "@/convex/_generated/dataModel"
import { daysUntil, probezeitEnde, terminUrgency } from "@/lib/utils"

const STATUS_COLORS: Record<string, string> = {
  Qualifizierung: "bg-violet-100 text-violet-700 border-violet-200",
  "LEA-Fast-Lane": "bg-blue-100 text-blue-700 border-blue-200",
  Visum: "bg-amber-100 text-amber-700 border-amber-200",
  "Onboarding / Berlin-Phase": "bg-orange-100 text-orange-700 border-orange-200",
  Abgeschlossen: "bg-primary/10 text-primary border-primary/20",
}

const ACTIVITY_ICONS: Record<string, React.ElementType> = {
  created: Plus,
  status_change: ArrowRightCircle,
  note_added: MessageSquare,
  document_uploaded: FileUp,
  details_updated: User,
  compliance_status_change: CheckCircle2,
  compliance_document_uploaded: Paperclip,
  termin_created: CalendarPlus,
  termin_status_change: CheckCircle2,
  finanzen_honorar_change: Euro,
  finanzen_status_change: Euro,
}

const FINANZEN_STATUS_COLORS: Record<string, string> = {
  Offen: "bg-gray-50 text-gray-500 border-gray-200",
  "Fällig": "bg-amber-50 text-amber-700 border-amber-200",
  Bezahlt: "bg-emerald-50 text-emerald-700 border-emerald-200",
}

const ART_ICONS: Record<string, React.ElementType> = {
  LEA: Stamp,
  "Bankeröffnung": Landmark,
  "Bürgeramt": Building2,
  Sonstiges: MoreHorizontal,
}

const B1_STATUS_OPTIONS = ["In Ausbildung", "Bestanden", "Nicht gestartet"] as const

function toDateInputValue(ts?: number) {
  if (!ts) return ""
  return new Date(ts).toISOString().slice(0, 10)
}

function fromDateInputValue(value: string): number | undefined {
  if (!value) return undefined
  return new Date(value).getTime()
}

function formatDate(ts?: number) {
  if (!ts) return "—"
  return new Date(ts).toLocaleDateString("de-DE")
}

function FristenBadge({ days }: { days: number | null }) {
  if (days === null || days > 30) return null
  return (
    <span
      className={`inline-flex items-center gap-1 border px-1.5 py-[3px] text-[10px] font-semibold leading-none ${
        days <= 0
          ? "border-red-200 bg-red-50 text-red-700"
          : "border-amber-200 bg-amber-50 text-amber-700"
      }`}
    >
      <AlertTriangle className="size-2.5" />
      {days <= 0 ? "abgelaufen" : `${days}d`}
    </span>
  )
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR" }).format(amount)
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)
}

function DetailRow({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 flex size-8 items-center justify-center bg-primary/5 text-primary ring-1 ring-primary/10">
        <Icon className="size-4" />
      </div>
      <div className="min-w-0">
        <p className="text-[11px] font-medium text-muted-foreground/70">{label}</p>
        <p className="text-sm font-medium text-foreground truncate">{value}</p>
      </div>
    </div>
  )
}

export default function CandidateDetailPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as Id<"candidates">
  const currentUser = useQuery(api.users.getCurrentUser)
  const candidate = useQuery(api.candidates.getById, { id })
  const documents = useQuery(api.documents.listByCandidate, { candidateId: id })
  const activityLog = useQuery(api.activityLog.listByCandidate, { candidateId: id })
  const complianceStatus = useQuery(api.complianceDocuments.getComplianceStatus, { candidateId: id })
  const updateNotes = useMutation(api.candidates.updateNotes)
  const updateStatus = useMutation(api.candidates.updateStatus)
  const updateDetails = useMutation(api.candidates.updateDetails)
  const generateUploadUrl = useMutation(api.documents.generateUploadUrl)
  const saveDocument = useMutation(api.documents.saveDocument)
  const deleteDocument = useMutation(api.documents.remove)
  const deleteCandidate = useMutation(api.candidates.remove)
  const setComplianceStatus = useMutation(api.complianceDocuments.setComplianceStatus)
  const attachComplianceDocument = useMutation(api.complianceDocuments.attachDocument)
  const removeComplianceDocument = useMutation(api.complianceDocuments.removeDocument)
  const termine = useQuery(api.termine.listByCandidate, { candidateId: id })
  const createTermin = useMutation(api.termine.create)
  const updateTerminStatus = useMutation(api.termine.updateStatus)
  const removeTermin = useMutation(api.termine.remove)
  const avatarUrl = useQuery(api.candidates.getAvatarUrl, { candidateId: id })
  const setAvatar = useMutation(api.candidates.setAvatar)
  const removeAvatarMutation = useMutation(api.candidates.removeAvatar)
  const finanzen = useQuery(api.finanzen.getByCandidateId, { candidateId: id })
  const updateHonorar = useMutation(api.finanzen.updateHonorar)
  const setFinanzenStatus = useMutation(api.finanzen.setStatus)
  const contacts = useQuery(api.contacts.list)
  const setEinrichtung = useMutation(api.candidates.setEinrichtung)

  const fileInputRef = useRef<HTMLInputElement>(null)
  const [notesDraft, setNotesDraft] = useState("")
  const [saving, setSaving] = useState(false)
  const [statusOpen, setStatusOpen] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [docType, setDocType] = useState("cv")
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const statusRef = useRef<HTMLDivElement>(null)

  const [stammdatenDraft, setStammdatenDraft] = useState({
    geburtsdatum: "",
    passnummer: "",
    herkunftsland: "",
  })
  const [savingStammdaten, setSavingStammdaten] = useState(false)
  const [qualifikationDraft, setQualifikationDraft] = useState({
    b1Status: "",
    datumB1Pruefung: "",
    aktuellerSprachkurs: "",
  })
  const [savingQualifikation, setSavingQualifikation] = useState(false)
  const [logistikDraft, setLogistikDraft] = useState({
    flugdatum: "",
    landungsdatumBerlin: "",
    ablaufdatumVisum: "",
    ersterArbeitstag: "",
  })
  const [savingLogistik, setSavingLogistik] = useState(false)
  const [uploadingDocType, setUploadingDocType] = useState<string | null>(null)

  const [terminDraft, setTerminDraft] = useState({
    datum: "",
    uhrzeit: "",
    art: "LEA" as (typeof TERMIN_ARTEN)[number],
    notizen: "",
  })
  const [addingTermin, setAddingTermin] = useState(false)
  const [uploadingAvatar, setUploadingAvatar] = useState(false)
  const [bezahldatumDraft, setBezahldatumDraft] = useState("")
  const hasScrolledToTermine = useRef(false)

  useEffect(() => {
    if (candidate && !hasScrolledToTermine.current && window.location.hash === "#termine-section") {
      hasScrolledToTermine.current = true
      document.getElementById("termine-section")?.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  }, [candidate])

  const handleUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const uploadUrl = await generateUploadUrl()
      const resp = await fetch(uploadUrl, { method: "POST", body: file })
      const { storageId } = await resp.json()
      await saveDocument({ candidateId: id, name: file.name, type: docType, storageId })
    } finally {
      setUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ""
    }
  }, [id, docType, generateUploadUrl, saveDocument])

  const handleDeleteDoc = useCallback(async (docId: Id<"documents">) => {
    await deleteDocument({ id: docId })
  }, [deleteDocument])

  const handleComplianceUpload = useCallback(async (docType: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadingDocType(docType)
    try {
      const uploadUrl = await generateUploadUrl()
      const resp = await fetch(uploadUrl, { method: "POST", body: file })
      const { storageId } = await resp.json()
      await attachComplianceDocument({ candidateId: id, docType, storageId })
    } finally {
      setUploadingDocType(null)
      e.target.value = ""
    }
  }, [id, generateUploadUrl, attachComplianceDocument])

  const handleAvatarUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadingAvatar(true)
    try {
      const uploadUrl = await generateUploadUrl()
      const resp = await fetch(uploadUrl, { method: "POST", body: file })
      const { storageId } = await resp.json()
      await setAvatar({ id, storageId })
    } finally {
      setUploadingAvatar(false)
      e.target.value = ""
    }
  }, [id, generateUploadUrl, setAvatar])

  const handleHonorarChange = useCallback(async (honorarbetrag: (typeof HONORARBETRAG_OPTIONS)[number]) => {
    await updateHonorar({
      candidateId: id,
      honorarbetrag,
      rabattAngewendet: honorarbetrag === "8000",
    })
  }, [id, updateHonorar])

  const handleFinanzenStatusChange = useCallback(async (status: (typeof FINANZEN_STATUSES)[number]) => {
    await setFinanzenStatus({
      candidateId: id,
      status,
      bezahldatum: status === "Bezahlt" ? (fromDateInputValue(bezahldatumDraft) ?? Date.now()) : undefined,
    })
  }, [id, setFinanzenStatus, bezahldatumDraft])

  const handleBezahldatumChange = useCallback(async (value: string) => {
    setBezahldatumDraft(value)
    if (finanzen?.status === "Bezahlt") {
      await setFinanzenStatus({
        candidateId: id,
        status: "Bezahlt",
        bezahldatum: fromDateInputValue(value),
      })
    }
  }, [id, finanzen?.status, setFinanzenStatus])

  const handleAddTermin = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    if (!terminDraft.datum || !terminDraft.uhrzeit) return
    setAddingTermin(true)
    try {
      await createTermin({
        candidateId: id,
        datum: new Date(terminDraft.datum).getTime(),
        uhrzeit: terminDraft.uhrzeit,
        art: terminDraft.art,
        notizen: terminDraft.notizen || undefined,
      })
      setTerminDraft({ datum: "", uhrzeit: "", art: "LEA", notizen: "" })
    } finally {
      setAddingTermin(false)
    }
  }, [id, terminDraft, createTermin])

  if (candidate === undefined) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (candidate === null) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <User className="size-10 text-muted-foreground/40" />
        <p className="mt-4 text-sm font-medium text-muted-foreground">Talent nicht gefunden</p>
        <Link href="/dashboard/candidates" className="mt-2 text-sm text-primary hover:underline">
          Zurück zu Talenten
        </Link>
      </div>
    )
  }

  const handleSaveNotes = async () => {
    setSaving(true)
    try {
      await updateNotes({ id: candidate._id, notes: notesDraft || candidate.notes })
    } finally {
      setSaving(false)
    }
  }

  const handleStatusChange = async (newStatus: string) => {
    setStatusOpen(false)
    if (newStatus === candidate.status) return
    await updateStatus({ id: candidate._id, status: newStatus, position: 0 })
  }

  const handleSaveStammdaten = async () => {
    setSavingStammdaten(true)
    try {
      await updateDetails({
        id: candidate._id,
        geburtsdatum: stammdatenDraft.geburtsdatum
          ? fromDateInputValue(stammdatenDraft.geburtsdatum)
          : candidate.geburtsdatum,
        passnummer: stammdatenDraft.passnummer || candidate.passnummer,
        herkunftsland: stammdatenDraft.herkunftsland || candidate.herkunftsland,
      })
    } finally {
      setSavingStammdaten(false)
    }
  }

  const handleSaveQualifikation = async () => {
    setSavingQualifikation(true)
    try {
      await updateDetails({
        id: candidate._id,
        b1Status: (qualifikationDraft.b1Status || candidate.b1Status) as
          | "In Ausbildung"
          | "Bestanden"
          | "Nicht gestartet"
          | undefined,
        datumB1Pruefung: qualifikationDraft.datumB1Pruefung
          ? fromDateInputValue(qualifikationDraft.datumB1Pruefung)
          : candidate.datumB1Pruefung,
        aktuellerSprachkurs: qualifikationDraft.aktuellerSprachkurs || candidate.aktuellerSprachkurs,
      })
    } finally {
      setSavingQualifikation(false)
    }
  }

  const handleSaveLogistik = async () => {
    setSavingLogistik(true)
    try {
      await updateDetails({
        id: candidate._id,
        flugdatum: logistikDraft.flugdatum
          ? fromDateInputValue(logistikDraft.flugdatum)
          : candidate.flugdatum,
        landungsdatumBerlin: logistikDraft.landungsdatumBerlin
          ? fromDateInputValue(logistikDraft.landungsdatumBerlin)
          : candidate.landungsdatumBerlin,
        ablaufdatumVisum: logistikDraft.ablaufdatumVisum
          ? fromDateInputValue(logistikDraft.ablaufdatumVisum)
          : candidate.ablaufdatumVisum,
        ersterArbeitstag: logistikDraft.ersterArbeitstag
          ? fromDateInputValue(logistikDraft.ersterArbeitstag)
          : candidate.ersterArbeitstag,
      })
    } finally {
      setSavingLogistik(false)
    }
  }

  const handleDelete = async () => {
    setDeleting(true)
    try {
      await deleteCandidate({ id: candidate._id })
      router.push("/dashboard/candidates")
    } finally {
      setDeleting(false)
    }
  }

  const isGstc = currentUser?.role === "gstc"

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center justify-between">
        <Link
          href="/dashboard/candidates"
          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors w-fit"
        >
          <ArrowLeft className="size-4" />
          Zurück zu Talenten
        </Link>
        {!isGstc && (
          <Button variant="destructive" size="sm" onClick={() => setDeleteOpen(true)} className="gap-1.5">
            <Trash2 className="size-3.5" />
            Löschen
          </Button>
        )}
      </div>

      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="relative group shrink-0">
            {avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={avatarUrl}
                alt={candidate.name}
                className="size-16 rounded-full object-cover ring-1 ring-primary/10"
              />
            ) : (
              <div className="flex size-16 items-center justify-center rounded-full bg-primary/5 text-lg font-bold text-primary ring-1 ring-primary/10">
                {getInitials(candidate.name)}
              </div>
            )}
            <input
              id="avatar-upload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarUpload}
            />
            <label
              htmlFor="avatar-upload"
              className="absolute inset-0 flex items-center justify-center rounded-full bg-black/0 group-hover:bg-black/40 transition-colors cursor-pointer"
            >
              {uploadingAvatar ? (
                <Loader2 className="size-4 text-white animate-spin" />
              ) : (
                <Camera className="size-4 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
              )}
            </label>
            {avatarUrl && (
              <button
                type="button"
                onClick={() => removeAvatarMutation({ id })}
                className="absolute -right-1 -top-1 flex size-5 items-center justify-center rounded-full bg-white text-gray-400 ring-1 ring-gray-200 hover:text-red-500 transition-colors"
                aria-label="Profilbild entfernen"
              >
                <Trash2 className="size-2.5" />
              </button>
            )}
          </div>
          <div>
            <h1 className="font-heading text-2xl font-bold text-primary">{candidate.name}</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Hinzugefügt am {new Date(candidate._creationTime).toLocaleDateString("de-DE")}
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-4 border border-gray-200 bg-white p-5 sm:grid-cols-2">
        <DetailRow icon={User} label="Name" value={candidate.name} />
        <DetailRow icon={Mail} label="E-Mail" value={candidate.email} />
        <DetailRow icon={Phone} label="Telefon" value={candidate.telefon || "—"} />
        <DetailRow icon={Tag} label="Quelle" value={candidate.source || "—"} />
        <DetailRow icon={Globe} label="Sprache" value={candidate.lang.toUpperCase()} />
        {!isGstc && (
          <>
            <DetailRow icon={Cake} label="Geburtsdatum" value={formatDate(candidate.geburtsdatum)} />
            <DetailRow icon={CreditCard} label="Passnummer" value={candidate.passnummer || "—"} />
            <DetailRow icon={MapPin} label="Herkunftsland" value={candidate.herkunftsland || "—"} />
            <DetailRow
              icon={Building2}
              label="Einrichtung"
              value={
                candidate.einrichtungId ? (
                  <Link href={`/dashboard/contacts/${candidate.einrichtungId}`} className="hover:text-primary hover:underline">
                    {contacts?.find((c) => c._id === candidate.einrichtungId)?.name ?? "…"}
                  </Link>
                ) : (
                  "—"
                )
              }
            />
          </>
        )}
      </div>

      {!isGstc && (
      <>
      <div className="border border-gray-200 bg-white p-5">
        <div className="flex items-center gap-2 mb-4">
          <User className="size-4 text-primary" />
          <h2 className="font-heading text-sm font-bold text-foreground tracking-tight">Stammdaten bearbeiten</h2>
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          <label className="text-xs font-medium text-muted-foreground/70">
            Geburtsdatum
            <input
              type="date"
              value={stammdatenDraft.geburtsdatum || toDateInputValue(candidate.geburtsdatum)}
              onChange={(e) => setStammdatenDraft((d) => ({ ...d, geburtsdatum: e.target.value }))}
              className="mt-1 w-full h-9 border border-gray-200 bg-gray-50/50 px-2 text-sm text-foreground focus:outline-none focus:border-primary/30 focus:ring-[1.5px] focus:ring-primary/15"
            />
          </label>
          <label className="text-xs font-medium text-muted-foreground/70">
            Passnummer
            <input
              type="text"
              value={stammdatenDraft.passnummer || candidate.passnummer || ""}
              onChange={(e) => setStammdatenDraft((d) => ({ ...d, passnummer: e.target.value }))}
              className="mt-1 w-full h-9 border border-gray-200 bg-gray-50/50 px-2 text-sm text-foreground focus:outline-none focus:border-primary/30 focus:ring-[1.5px] focus:ring-primary/15"
            />
          </label>
          <label className="text-xs font-medium text-muted-foreground/70">
            Herkunftsland
            <input
              type="text"
              value={stammdatenDraft.herkunftsland || candidate.herkunftsland || ""}
              onChange={(e) => setStammdatenDraft((d) => ({ ...d, herkunftsland: e.target.value }))}
              className="mt-1 w-full h-9 border border-gray-200 bg-gray-50/50 px-2 text-sm text-foreground focus:outline-none focus:border-primary/30 focus:ring-[1.5px] focus:ring-primary/15"
            />
          </label>
          <label className="text-xs font-medium text-muted-foreground/70">
            Einrichtung
            <select
              value={candidate.einrichtungId ?? ""}
              onChange={(e) =>
                setEinrichtung({
                  id: candidate._id,
                  einrichtungId: e.target.value ? (e.target.value as Id<"contacts">) : undefined,
                })
              }
              className="mt-1 w-full h-9 border border-gray-200 bg-gray-50/50 px-2 text-sm text-foreground focus:outline-none focus:border-primary/30 focus:ring-[1.5px] focus:ring-primary/15"
            >
              <option value="">— keine —</option>
              {contacts?.map((c) => (
                <option key={c._id} value={c._id}>{c.name}</option>
              ))}
            </select>
          </label>
        </div>
        <Button
          onClick={handleSaveStammdaten}
          disabled={savingStammdaten}
          size="sm"
          className="mt-4 bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm text-xs h-8"
        >
          {savingStammdaten && <Loader2 className="size-4 animate-spin" />}
          Speichern
        </Button>
      </div>

      <div className="border border-gray-200 bg-white p-5">
        <div className="flex items-center gap-2 mb-4">
          <GraduationCap className="size-4 text-primary" />
          <h2 className="font-heading text-sm font-bold text-foreground tracking-tight">Qualifikation &amp; Sprache</h2>
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          <label className="text-xs font-medium text-muted-foreground/70">
            B1-Status
            <select
              value={qualifikationDraft.b1Status || candidate.b1Status || ""}
              onChange={(e) => setQualifikationDraft((d) => ({ ...d, b1Status: e.target.value }))}
              className="mt-1 w-full h-9 border border-gray-200 bg-gray-50/50 px-2 text-sm text-foreground focus:outline-none focus:border-primary/30 focus:ring-[1.5px] focus:ring-primary/15"
            >
              <option value="">—</option>
              {B1_STATUS_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </label>
          <label className="text-xs font-medium text-muted-foreground/70">
            Datum B1-Prüfung
            <input
              type="date"
              value={qualifikationDraft.datumB1Pruefung || toDateInputValue(candidate.datumB1Pruefung)}
              onChange={(e) => setQualifikationDraft((d) => ({ ...d, datumB1Pruefung: e.target.value }))}
              className="mt-1 w-full h-9 border border-gray-200 bg-gray-50/50 px-2 text-sm text-foreground focus:outline-none focus:border-primary/30 focus:ring-[1.5px] focus:ring-primary/15"
            />
          </label>
          <label className="text-xs font-medium text-muted-foreground/70">
            Aktueller Sprachkurs
            <input
              type="text"
              value={qualifikationDraft.aktuellerSprachkurs || candidate.aktuellerSprachkurs || ""}
              onChange={(e) => setQualifikationDraft((d) => ({ ...d, aktuellerSprachkurs: e.target.value }))}
              className="mt-1 w-full h-9 border border-gray-200 bg-gray-50/50 px-2 text-sm text-foreground focus:outline-none focus:border-primary/30 focus:ring-[1.5px] focus:ring-primary/15"
            />
          </label>
        </div>
        <Button
          onClick={handleSaveQualifikation}
          disabled={savingQualifikation}
          size="sm"
          className="mt-4 bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm text-xs h-8"
        >
          {savingQualifikation && <Loader2 className="size-4 animate-spin" />}
          Speichern
        </Button>
      </div>

      <div className="border border-gray-200 bg-white p-5">
        <div className="flex items-center gap-2 mb-4">
          <Plane className="size-4 text-primary" />
          <h2 className="font-heading text-sm font-bold text-foreground tracking-tight">Logistik &amp; Fristen</h2>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="text-xs font-medium text-muted-foreground/70">
            Flugdatum
            <input
              type="date"
              value={logistikDraft.flugdatum || toDateInputValue(candidate.flugdatum)}
              onChange={(e) => setLogistikDraft((d) => ({ ...d, flugdatum: e.target.value }))}
              className="mt-1 w-full h-9 border border-gray-200 bg-gray-50/50 px-2 text-sm text-foreground focus:outline-none focus:border-primary/30 focus:ring-[1.5px] focus:ring-primary/15"
            />
          </label>
          <label className="text-xs font-medium text-muted-foreground/70">
            Landungsdatum Berlin
            <input
              type="date"
              value={logistikDraft.landungsdatumBerlin || toDateInputValue(candidate.landungsdatumBerlin)}
              onChange={(e) => setLogistikDraft((d) => ({ ...d, landungsdatumBerlin: e.target.value }))}
              className="mt-1 w-full h-9 border border-gray-200 bg-gray-50/50 px-2 text-sm text-foreground focus:outline-none focus:border-primary/30 focus:ring-[1.5px] focus:ring-primary/15"
            />
          </label>
          <label className="text-xs font-medium text-muted-foreground/70">
            <span className="flex items-center justify-between gap-2">
              Ablaufdatum Visum
              <FristenBadge days={daysUntil(candidate.ablaufdatumVisum)} />
            </span>
            <input
              type="date"
              value={logistikDraft.ablaufdatumVisum || toDateInputValue(candidate.ablaufdatumVisum)}
              onChange={(e) => setLogistikDraft((d) => ({ ...d, ablaufdatumVisum: e.target.value }))}
              className="mt-1 w-full h-9 border border-gray-200 bg-gray-50/50 px-2 text-sm text-foreground focus:outline-none focus:border-primary/30 focus:ring-[1.5px] focus:ring-primary/15"
            />
          </label>
          <label className="text-xs font-medium text-muted-foreground/70">
            Erster dokumentierter Arbeitstag
            <input
              type="date"
              value={logistikDraft.ersterArbeitstag || toDateInputValue(candidate.ersterArbeitstag)}
              onChange={(e) => setLogistikDraft((d) => ({ ...d, ersterArbeitstag: e.target.value }))}
              className="mt-1 w-full h-9 border border-gray-200 bg-gray-50/50 px-2 text-sm text-foreground focus:outline-none focus:border-primary/30 focus:ring-[1.5px] focus:ring-primary/15"
            />
          </label>
        </div>
        <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground/70">
          <CalendarClock className="size-3.5" />
          Probezeit-Ende (berechnet):{" "}
          <span className="font-medium text-foreground">
            {formatDate(probezeitEnde(candidate.ersterArbeitstag))}
          </span>
          <FristenBadge days={daysUntil(probezeitEnde(candidate.ersterArbeitstag))} />
        </div>
        <Button
          onClick={handleSaveLogistik}
          disabled={savingLogistik}
          size="sm"
          className="mt-4 bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm text-xs h-8"
        >
          {savingLogistik && <Loader2 className="size-4 animate-spin" />}
          Speichern
        </Button>
      </div>
      </>
      )}

      <div className="border border-gray-200 bg-white p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Briefcase className="size-4 text-primary" />
            <h2 className="font-heading text-sm font-bold text-foreground tracking-tight">Compliance-Dokumente</h2>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-muted-foreground/70">
              {complianceStatus ? `${complianceStatus.receivedCount} / ${complianceStatus.totalCount} erhalten` : "…"}
            </span>
            {complianceStatus?.allReceived && (
              <span className="inline-flex items-center gap-1 border border-emerald-200 bg-emerald-50 px-2 py-1 text-[11px] font-semibold text-emerald-700">
                <ShieldCheck className="size-3.5" />
                Ready for LEA
              </span>
            )}
          </div>
        </div>

        {complianceStatus === undefined ? (
          <div className="h-8 flex items-center">
            <Loader2 className="size-3.5 animate-spin text-gray-400" />
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {complianceStatus.items.map((item) => (
              <div key={item.docType} className="flex items-center justify-between gap-3 py-2.5">
                <p className="text-sm text-gray-700 min-w-0 truncate">{item.label}</p>
                <div className="flex items-center gap-1.5 shrink-0">
                  {item.url && (
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center size-7 text-gray-400 hover:text-primary transition-colors"
                    >
                      <Download className="size-3.5" />
                    </a>
                  )}
                  {item.url && !isGstc && (
                    <button
                      type="button"
                      onClick={() => removeComplianceDocument({ candidateId: id, docType: item.docType })}
                      className="flex items-center justify-center size-7 text-gray-300 hover:text-red-500 transition-colors"
                      aria-label={`Datei zu ${item.label} entfernen`}
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  )}
                  <input
                    id={`compliance-upload-${item.docType}`}
                    type="file"
                    className="hidden"
                    onChange={(e) => handleComplianceUpload(item.docType, e)}
                  />
                  <label
                    htmlFor={`compliance-upload-${item.docType}`}
                    className="flex items-center justify-center size-7 text-gray-400 hover:text-primary transition-colors cursor-pointer"
                  >
                    {uploadingDocType === item.docType ? (
                      <Loader2 className="size-3.5 animate-spin" />
                    ) : (
                      <Paperclip className="size-3.5" />
                    )}
                  </label>
                  {isGstc ? (
                    <span
                      className={`flex items-center gap-1.5 border px-2 py-1 text-[11px] font-semibold ${
                        item.status === "Erhalten"
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                          : "bg-gray-50 text-gray-500 border-gray-200"
                      }`}
                    >
                      {item.status === "Erhalten" ? (
                        <CheckCircle2 className="size-3.5" />
                      ) : (
                        <Circle className="size-3.5" />
                      )}
                      {item.status}
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() =>
                        setComplianceStatus({
                          candidateId: id,
                          docType: item.docType,
                          status: item.status === "Erhalten" ? "Fehlt" : "Erhalten",
                        })
                      }
                      className={`flex items-center gap-1.5 border px-2 py-1 text-[11px] font-semibold transition-all ${
                        item.status === "Erhalten"
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                          : "bg-gray-50 text-gray-500 border-gray-200"
                      }`}
                    >
                      {item.status === "Erhalten" ? (
                        <CheckCircle2 className="size-3.5" />
                      ) : (
                        <Circle className="size-3.5" />
                      )}
                      {item.status}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {!isGstc && (
      <div id="termine-section" className="border border-gray-200 bg-white p-5">
        <div className="flex items-center gap-2 mb-4">
          <CalendarPlus className="size-4 text-primary" />
          <h2 className="font-heading text-sm font-bold text-foreground tracking-tight">Termine</h2>
        </div>

        <form onSubmit={handleAddTermin} className="flex flex-wrap items-end gap-2 mb-4">
          <input
            type="date"
            value={terminDraft.datum}
            onChange={(e) => setTerminDraft((d) => ({ ...d, datum: e.target.value }))}
            required
            className="h-8 border border-gray-200 bg-gray-50/80 px-2 text-xs text-gray-600 focus:outline-none focus:border-primary/30 focus:ring-[1.5px] focus:ring-primary/15"
          />
          <input
            type="time"
            value={terminDraft.uhrzeit}
            onChange={(e) => setTerminDraft((d) => ({ ...d, uhrzeit: e.target.value }))}
            required
            className="h-8 border border-gray-200 bg-gray-50/80 px-2 text-xs text-gray-600 focus:outline-none focus:border-primary/30 focus:ring-[1.5px] focus:ring-primary/15"
          />
          <select
            value={terminDraft.art}
            onChange={(e) => setTerminDraft((d) => ({ ...d, art: e.target.value as (typeof TERMIN_ARTEN)[number] }))}
            className="h-8 border border-gray-200 bg-gray-50/80 px-2 text-xs font-medium text-gray-600 focus:outline-none focus:border-primary/30 focus:ring-[1.5px] focus:ring-primary/15"
          >
            {TERMIN_ARTEN.map((a) => (
              <option key={a} value={a}>{a}</option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Notizen (optional)"
            value={terminDraft.notizen}
            onChange={(e) => setTerminDraft((d) => ({ ...d, notizen: e.target.value }))}
            className="h-8 min-w-[140px] flex-1 border border-gray-200 bg-gray-50/80 px-2 text-xs text-gray-600 focus:outline-none focus:border-primary/30 focus:ring-[1.5px] focus:ring-primary/15"
          />
          <Button
            type="submit"
            size="sm"
            disabled={addingTermin}
            className="text-xs gap-1.5 h-8 bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm"
          >
            {addingTermin ? <Loader2 className="size-3.5 animate-spin" /> : <Plus className="size-3.5" />}
            Hinzufügen
          </Button>
        </form>

        {termine === undefined ? (
          <div className="h-8 flex items-center">
            <Loader2 className="size-3.5 animate-spin text-gray-400" />
          </div>
        ) : termine.length > 0 ? (
          <div className="divide-y divide-gray-100">
            {[...termine].sort((a, b) => a.datum - b.datum).map((termin) => {
              const ArtIcon = ART_ICONS[termin.art] ?? MoreHorizontal
              const urgency = terminUrgency(termin.datum, termin.status)
              const urgencyBorder =
                urgency === "ueberfaellig"
                  ? "border-red-400"
                  : urgency === "bald"
                    ? "border-amber-400"
                    : "border-transparent"
              return (
                <div key={termin._id} className={`flex items-center justify-between gap-3 py-2.5 border-l-2 pl-2.5 ${urgencyBorder}`}>
                  <div className="flex items-center gap-2.5 min-w-0">
                    <ArtIcon className="size-4 text-gray-400 shrink-0" />
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {formatDate(termin.datum)} · {termin.uhrzeit} · {termin.art}
                      </p>
                      {termin.notizen && (
                        <p className="text-[11px] text-gray-400 truncate">{termin.notizen}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
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
                        <CheckCircle2 className="size-3.5" />
                      ) : (
                        <Circle className="size-3.5" />
                      )}
                      {termin.status}
                    </button>
                    <button
                      type="button"
                      onClick={() => removeTermin({ id: termin._id })}
                      className="flex items-center justify-center size-7 text-gray-300 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <p className="text-xs text-gray-400 py-2">Noch keine Termine.</p>
        )}
      </div>
      )}

      <div className="border border-gray-200 bg-white p-5">
        <div className="flex items-center gap-2 mb-4">
          <FileText className="size-4 text-primary" />
          <h2 className="font-heading text-sm font-bold text-foreground tracking-tight">Status</h2>
        </div>

        {isGstc ? (
          <span
            className={`flex w-fit items-center gap-2 border px-3 py-2 text-sm font-medium ${
              STATUS_COLORS[candidate.status] ?? "bg-muted text-muted-foreground border-border"
            }`}
          >
            {candidate.status}
          </span>
        ) : (
          <div className="relative" ref={statusRef}>
            <button
              type="button"
              onClick={() => setStatusOpen(!statusOpen)}
              className={`flex items-center gap-2 border px-3 py-2 text-sm font-medium transition-all hover:opacity-80 ${
                STATUS_COLORS[candidate.status] ?? "bg-muted text-muted-foreground border-border"
              }`}
            >
              {candidate.status}
              <ChevronDown className={`size-3.5 transition-transform duration-200 ${statusOpen ? "rotate-180" : ""}`} />
            </button>

            {statusOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setStatusOpen(false)} />
                <div className="absolute top-full left-0 mt-1 z-20 w-48 border border-gray-200 bg-white py-1 shadow-sm">
                  {CANDIDATE_STATUSES.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => handleStatusChange(s)}
                      className={`flex w-full items-center px-3 py-2 text-left text-sm transition-colors ${
                        candidate.status === s
                          ? "bg-primary/10 text-primary font-medium"
                          : "text-foreground hover:bg-gray-50"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {currentUser?.role === "admin" && (
        <div className="border border-gray-200 bg-white p-5">
          <div className="flex items-center gap-2 mb-4">
            <Euro className="size-4 text-primary" />
            <h2 className="font-heading text-sm font-bold text-foreground tracking-tight">Finanzen</h2>
          </div>

          {!finanzen ? (
            <div className="h-8 flex items-center">
              <Loader2 className="size-3.5 animate-spin text-gray-400" />
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="text-xs font-medium text-muted-foreground/70">
                  Honorarbetrag
                  <select
                    value={finanzen.honorarbetrag}
                    onChange={(e) => handleHonorarChange(e.target.value as (typeof HONORARBETRAG_OPTIONS)[number])}
                    className="mt-1 w-full h-9 border border-gray-200 bg-gray-50/50 px-2 text-sm text-foreground focus:outline-none focus:border-primary/30 focus:ring-[1.5px] focus:ring-primary/15"
                  >
                    <option value="8500">8.500 € (Standard)</option>
                    <option value="8000">8.000 € (Neukundenrabatt)</option>
                  </select>
                  <span className="mt-1 block text-[11px] text-muted-foreground/60">
                    Neukundenrabatt befristet bis 31.12.2026
                  </span>
                </label>
                <label className="text-xs font-medium text-muted-foreground/70">
                  Bezahldatum
                  <input
                    type="date"
                    value={bezahldatumDraft || toDateInputValue(finanzen.bezahldatum)}
                    onChange={(e) => handleBezahldatumChange(e.target.value)}
                    className="mt-1 w-full h-9 border border-gray-200 bg-gray-50/50 px-2 text-sm text-foreground focus:outline-none focus:border-primary/30 focus:ring-[1.5px] focus:ring-primary/15"
                  />
                </label>
              </div>

              <div>
                <p className="text-xs font-medium text-muted-foreground/70 mb-1.5">Status</p>
                <div className="flex flex-wrap gap-1.5">
                  {FINANZEN_STATUSES.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => handleFinanzenStatusChange(s)}
                      className={`border px-2.5 py-1 text-[11px] font-semibold transition-all ${
                        finanzen.status === s
                          ? FINANZEN_STATUS_COLORS[s]
                          : "bg-white text-gray-400 border-gray-200 hover:bg-gray-50"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs text-muted-foreground/70 pt-1 border-t border-gray-100">
                <CalendarClock className="size-3.5" />
                Fälligkeitsdatum: <span className="font-medium text-foreground">{formatDate(finanzen.faelligkeitsdatum)}</span>
                <span className="text-muted-foreground/50">·</span>
                <span className="font-medium text-foreground">{formatCurrency(Number(finanzen.honorarbetrag))}</span>
              </div>
            </div>
          )}
        </div>
      )}

      {!isGstc && (
      <>
      <div className="border border-gray-200 bg-white p-5">
        <div className="flex items-center gap-2 mb-4">
          <Upload className="size-4 text-primary" />
          <h2 className="font-heading text-sm font-bold text-foreground tracking-tight">Dokumente</h2>
        </div>

        <div className="flex items-center gap-2 mb-4">
          <select
            value={docType}
            onChange={(e) => setDocType(e.target.value)}
            className="h-8 border border-gray-200 bg-gray-50/80 px-2 text-xs font-medium text-gray-600 focus:outline-none focus:border-primary/30 focus:ring-[1.5px] focus:ring-primary/15"
          >
            <option value="cv">Lebenslauf</option>
            <option value="zeugnis">Zeugnis</option>
            <option value="sonstiges">Sonstiges</option>
          </select>
          <input
            ref={fileInputRef}
            type="file"
            onChange={handleUpload}
            className="hidden"
          />
          <Button
            type="button"
            size="sm"
            disabled={uploading}
            onClick={() => fileInputRef.current?.click()}
            className="text-xs gap-1.5 h-8 bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm"
          >
            {uploading ? <Loader2 className="size-3.5 animate-spin" /> : <Upload className="size-3.5" />}
            {uploading ? "Wird hochgeladen..." : "Hochladen"}
          </Button>
        </div>

        {documents === undefined ? (
          <div className="h-8 flex items-center">
            <Loader2 className="size-3.5 animate-spin text-gray-400" />
          </div>
        ) : documents.length > 0 ? (
          <div className="divide-y divide-gray-100">
            {documents.map((doc) => (
              <div key={doc._id} className="flex items-center justify-between py-2.5">
                <div className="flex items-center gap-2.5 min-w-0">
                  <FileText className="size-4 text-gray-400 shrink-0" />
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{doc.name}</p>
                    <p className="text-[10px] font-medium text-gray-400 uppercase">{doc.type}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  {doc.url && (
                    <a
                      href={doc.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center size-7 text-gray-400 hover:text-primary transition-colors"
                    >
                      <Download className="size-3.5" />
                    </a>
                  )}
                  <button
                    type="button"
                    onClick={() => handleDeleteDoc(doc._id)}
                    className="flex items-center justify-center size-7 text-gray-300 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="size-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-gray-400 py-2">Noch keine Dokumente hochgeladen.</p>
        )}
      </div>

      <div className="border border-gray-200 bg-white p-5">
        <div className="flex items-center gap-2 mb-3">
          <MessageSquare className="size-4 text-primary" />
          <h2 className="font-heading text-sm font-bold text-foreground tracking-tight">Notizen</h2>
        </div>
        <Textarea
          placeholder="Notizen zu diesem Talent hinzufügen..."
          value={notesDraft || candidate.notes || ""}
          onChange={(e) => setNotesDraft(e.target.value)}
          rows={5}
          className="mb-3 border-gray-200 bg-gray-50/50 text-sm focus-visible:border-primary/30 focus-visible:ring-[1.5px] focus-visible:ring-primary/15"
        />
        <Button
          onClick={handleSaveNotes}
          disabled={saving || notesDraft === candidate.notes}
          size="sm"
          className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm text-xs h-8"
        >
          {saving && <Loader2 className="size-4 animate-spin" />}
          Notizen speichern
        </Button>
      </div>

      <div className="border border-gray-200 bg-white p-5">
        <div className="flex items-center gap-2 mb-4">
          <Activity className="size-4 text-primary" />
          <h2 className="font-heading text-sm font-bold text-foreground tracking-tight">Verlauf</h2>
        </div>

        {activityLog === undefined ? (
          <div className="h-8 flex items-center">
            <Loader2 className="size-3.5 animate-spin text-gray-400" />
          </div>
        ) : activityLog.length > 0 ? (
          <div className="relative pl-5 before:absolute before:left-[7px] before:top-1 before:bottom-1 before:w-px before:bg-gray-200">
            {activityLog.map((entry) => {
              const Icon = ACTIVITY_ICONS[entry.type] ?? Clock
              return (
                <div key={entry._id} className="relative pb-4 last:pb-0">
                  <span className="absolute -left-[13px] flex size-[14px] items-center justify-center bg-white">
                    <Icon className="size-3 text-gray-400" />
                  </span>
                  <p className="text-sm text-gray-700">{entry.description}</p>
                  <p className="text-[10px] text-gray-400 mt-0.5">
                    {new Date(entry.timestamp).toLocaleString("de-DE")}
                  </p>
                </div>
              )
            })}
          </div>
        ) : (
          <p className="text-xs text-gray-400 py-2">Noch keine Aktivität.</p>
        )}
      </div>
      </>
      )}

      {!isGstc && (
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Talent löschen</DialogTitle>
            <DialogDescription>
              Bist du sicher, dass du dieses Talent löschen möchtest? Alle Dokumente und der Verlauf werden mitgelöscht. Das kann nicht rückgängig gemacht werden.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteOpen(false)}>
              Abbrechen
            </Button>
            <Button variant="destructive" disabled={deleting} onClick={handleDelete}>
              {deleting && <Loader2 className="size-4 animate-spin" />}
              Löschen
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      )}
    </div>
  )
}
