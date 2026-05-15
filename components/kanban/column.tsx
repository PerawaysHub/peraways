"use client"

import { useMemo } from "react"
import { AnimatePresence } from "framer-motion"
import { useDroppable } from "@dnd-kit/core"
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { KanbanCard } from "./card"
import { Plus } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Doc } from "@/convex/_generated/dataModel"

type Candidate = Doc<"candidates">

const THEMES: Record<string, {
  col: string
  dot: string
  count: string
  addBorder: string
  addText: string
}> = {
  "Neue Bewerbung": {
    col: "bg-violet-50/60 border-violet-200/50",
    dot: "bg-violet-400",
    count: "bg-violet-100 text-violet-700",
    addBorder: "border-violet-300/50",
    addText: "text-violet-600 hover:bg-violet-100/50",
  },
  Kontaktiert: {
    col: "bg-blue-50/60 border-blue-200/50",
    dot: "bg-blue-400",
    count: "bg-blue-100 text-blue-600",
    addBorder: "border-blue-300/50",
    addText: "text-blue-500 hover:bg-blue-100/50",
  },
  Gespräch: {
    col: "bg-amber-50/60 border-amber-200/50",
    dot: "bg-amber-400",
    count: "bg-amber-100 text-amber-600",
    addBorder: "border-amber-300/50",
    addText: "text-amber-500 hover:bg-amber-100/50",
  },
  Angebot: {
    col: "bg-orange-50/60 border-orange-200/50",
    dot: "bg-orange-400",
    count: "bg-orange-100 text-orange-600",
    addBorder: "border-orange-300/50",
    addText: "text-orange-500 hover:bg-orange-100/50",
  },
  Visum: {
    col: "bg-emerald-50/60 border-emerald-200/50",
    dot: "bg-emerald-400",
    count: "bg-emerald-100 text-emerald-600",
    addBorder: "border-emerald-300/50",
    addText: "text-emerald-500 hover:bg-emerald-100/50",
  },
  Gestartet: {
    col: "bg-primary/[0.03] border-primary/10",
    dot: "bg-primary",
    count: "bg-primary/10 text-primary",
    addBorder: "border-primary/20",
    addText: "text-primary/70 hover:bg-primary/5",
  },
}

interface KanbanColumnProps {
  status: string
  candidates: Candidate[]
  onAddClick: () => void
}

export function KanbanColumn({ status, candidates, onAddClick }: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id: status })
  const theme = THEMES[status] ?? THEMES["Neue Bewerbung"]
  const ids = useMemo(() => candidates.map((c) => c._id), [candidates])

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "relative flex flex-1 flex-col border min-w-[240px] md:min-w-[260px] max-w-[320px] md:max-w-[340px]",
        "transition-all duration-200",
        theme.col,
        isOver && "ring-2 ring-primary/20"
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-4 pb-3 shrink-0 border-b border-black/[0.04]">
        <div className="flex items-center gap-2 min-w-0">
          <span className={cn("size-2 shrink-0 ring-[1.5px] ring-inset", theme.dot)} />
          <h3 className="font-heading text-sm font-bold text-gray-700 truncate tracking-tight">{status}</h3>
          <span className={cn(
            "inline-flex items-center justify-center h-[18px] min-w-[18px] px-1 text-[10px] font-bold shrink-0 leading-none",
            theme.count
          )}>
            {candidates.length}
          </span>
        </div>
        <button
          type="button"
          onClick={onAddClick}
          className="flex items-center justify-center size-6 text-gray-400 hover:text-gray-600 hover:bg-white/70 transition-all"
          aria-label={`Add to ${status}`}
        >
          <Plus className="size-3.5" />
        </button>
      </div>

      {/* Cards */}
      <SortableContext items={ids} strategy={verticalListSortingStrategy}>
        <div className="flex flex-col gap-1 md:gap-1.5 px-2 md:px-3 py-2 md:py-3 overflow-y-auto min-h-0 max-h-[calc(100vh-340px)]">
          {candidates.length > 0 ? (
            <AnimatePresence>
              {candidates.map((c) => <KanbanCard key={c._id} candidate={c} />)}
            </AnimatePresence>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 px-4 text-center select-none">
              <div className="size-7 rounded flex items-center justify-center mb-2 bg-black/[0.02]">
                <Plus className="size-3.5 text-gray-300" />
              </div>
              <p className="text-[11px] font-medium text-gray-300">Drop a candidate here</p>
            </div>
          )}
        </div>
      </SortableContext>

      {/* Add button */}
      <div className="px-3 pb-3 shrink-0">
        <button
          type="button"
          onClick={onAddClick}
          className={cn(
            "flex w-full items-center justify-center gap-1.5 border border-dashed py-2.5 text-[11px] font-semibold transition-all",
            "hover:bg-white/60 active:scale-[0.98]",
            theme.addBorder,
            theme.addText
          )}
        >
          <Plus className="size-3.5" />
          Add
        </button>
      </div>
    </div>
  )
}
