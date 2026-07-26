"use client"

import { useState, useCallback, useMemo, useRef, useEffect } from "react"
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
  type DragStartEvent,
  type DragEndEvent,
} from "@dnd-kit/core"
import { useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { KanbanColumn } from "./column"
import { KanbanCard } from "./card"
import { Search, Plus, LayoutPanelTop } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { CANDIDATE_STATUSES } from "@/convex/schema"
import type { Doc, Id } from "@/convex/_generated/dataModel"

type Candidate = Doc<"candidates">

interface KanbanBoardProps {
  candidates: Candidate[] | undefined
  onAddCandidate: (status: string) => void
}

function groupByStatus(candidates: Candidate[]) {
  const map: Record<string, Candidate[]> = {}
  for (const s of CANDIDATE_STATUSES) map[s] = []
  for (const c of candidates) if (map[c.status]) map[c.status].push(c)
  for (const s of CANDIDATE_STATUSES) map[s].sort((a, b) => a.position - b.position)
  return map
}

export function KanbanBoard({ candidates, onAddCandidate }: KanbanBoardProps) {
  const [activeId, setActiveId] = useState<string | null>(null)
  const [search, setSearch] = useState("")
  const [cardWidth, setCardWidth] = useState(0)
  const [announcement, setAnnouncement] = useState("")
  const columnsRef = useRef<HTMLDivElement>(null)
  const updateStatus = useMutation(api.candidates.updateStatus)

  useEffect(() => {
    const el = columnsRef.current
    if (!el) return
    const measure = () => {
      const firstCol = el.firstElementChild
      if (firstCol) {
        setCardWidth(firstCol.getBoundingClientRect().width - 24)
      }
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [candidates])

  const filtered = useMemo(() => {
    if (!candidates || !search.trim()) return candidates
    const q = search.toLowerCase()
    return candidates.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q)
    )
  }, [candidates, search])

  const columns = useMemo(() => (filtered ? groupByStatus(filtered) : {}), [filtered])

  const activeCandidate = useMemo(
    () => (activeId && candidates ? candidates.find((c) => c._id === activeId) : null),
    [activeId, candidates]
  )

  const totalCount = candidates?.length ?? 0
  const filteredCount = filtered?.length ?? 0

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  )

  const handleDragStart = useCallback((e: DragStartEvent) => {
    setActiveId(e.active.id as string)
  }, [])

  const handleDragEnd = useCallback(
    async (e: DragEndEvent) => {
      setActiveId(null)
      const { active, over } = e
      if (!over || !candidates) return

      const activeId = active.id as string
      const overId = over.id as string
      if (activeId === overId) return

      const dragged = candidates.find((c) => c._id === activeId)
      if (!dragged) return

      const statuses = CANDIDATE_STATUSES as readonly string[]
      const isOverColumn = statuses.includes(overId)
      const overCard = isOverColumn ? null : candidates.find((c) => c._id === overId)
      const targetStatus = isOverColumn ? overId : (overCard?.status ?? dragged.status)
      if (!targetStatus || !statuses.includes(targetStatus)) return

      const colCandidates = candidates
        .filter((c) => c.status === targetStatus && c._id !== activeId)
        .sort((a, b) => a.position - b.position)

      let newPosition: number
      if (isOverColumn) {
        newPosition = colCandidates.length > 0 ? colCandidates[colCandidates.length - 1].position + 1 : 0
      } else {
        const overIdx = colCandidates.findIndex((c) => c._id === overId)
        if (overIdx === 0) {
          newPosition = colCandidates[0].position / 2
        } else if (overIdx > 0) {
          newPosition = (colCandidates[overIdx - 1].position + colCandidates[overIdx].position) / 2
        } else {
          newPosition = colCandidates.length > 0 ? colCandidates[colCandidates.length - 1].position + 1 : 0
        }
      }

      await updateStatus({ id: activeId as Id<"candidates">, status: targetStatus, position: newPosition })
    },
    [candidates, updateStatus]
  )

  return (
    <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm bg-gradient-to-br from-white via-white to-[var(--surface)]/40">
      <div aria-live="polite" aria-atomic="true" className="sr-only">
        {announcement}
      </div>
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <span className="flex size-8 items-center justify-center rounded-lg bg-primary/5 ring-1 ring-primary/10">
            <LayoutPanelTop className="size-4 text-primary" />
          </span>
          <div>
            <h2 className="font-heading text-base font-bold text-gray-900 leading-tight tracking-tight">
              Talente-Pipeline
            </h2>
            <p className="text-[11px] font-medium text-gray-400/80">
              {totalCount} Talent{totalCount !== 1 ? "e" : ""}
            </p>
          </div>
        </div>
        <Button
          size="sm"
          onClick={() => onAddCandidate("Qualifizierung")}
          className="text-xs gap-1.5 h-8 bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm"
        >
          <Plus className="size-3.5" />
          Talent hinzufügen
        </Button>
      </div>

      {/* Search */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-gray-100/60">
        <div className="relative w-60">
          <Input
            placeholder="Talente durchsuchen..."
            aria-label="Talente durchsuchen"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-9 bg-gray-50/80 border-gray-200/80 text-sm placeholder:text-gray-400 focus-visible:border-primary/30 focus-visible:ring-[1.5px] focus-visible:ring-primary/15"
          />
          <Search className="pointer-events-none absolute left-3 inset-y-0 my-auto size-4 text-gray-400" aria-hidden="true" />
        </div>
        {search && (
          <span aria-live="polite" className="text-[11px] font-medium text-gray-400 tabular-nums">
            {filteredCount} / {totalCount}
          </span>
        )}
      </div>

      {/* Board */}
      <div className="p-3 md:p-5 overflow-x-auto bg-[radial-gradient(ellipse_at_top_right,_var(--surface)_0%,_transparent_70%)]">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <div ref={columnsRef} className="flex gap-3 md:gap-4 pb-2 items-start">
            {CANDIDATE_STATUSES.map((status) => (
              <KanbanColumn
                key={status}
                status={status}
                candidates={columns[status] ?? []}
                onAddClick={() => onAddCandidate(status)}
              />
            ))}
          </div>

          <DragOverlay>
            {activeCandidate && (
              <div style={{ width: cardWidth > 0 ? cardWidth : undefined }}>
                <KanbanCard candidate={activeCandidate} />
              </div>
            )}
          </DragOverlay>
        </DndContext>
      </div>
    </div>
  )
}
