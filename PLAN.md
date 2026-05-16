# PeraWays — Plan de refonte (Convex + Clerk + Resend)

## ✅ Phase 1 — Foundation (Convex + formulaire fiable)

- [x] Installer `convex` + `resend`
- [x] Configurer Convex : `npx convex dev`
- [x] Définir le schema Convex (`contacts` + `candidates` tables)
- [x] Mutation `sendContactForm` → sauvegarde + email via Resend
- [x] Remplacer `Form.tsx` : appeler la mutation Convex au lieu du fetch GAS
- [x] Supprimer `scripts/apps-script.gs`
- [x] Landing page complète (DE/EN) — Navbar, Hero, Problem, Story, Services, Bridge, Stats, Form, Footer
- [x] Pages légales (Datenschutz, Impressum, Danke)
- [x] SEO (sitemap, robots, OpenGraph, JSON-LD)

### Restant Phase 1
- [x] Templates email HTML bilingues (DE/EN) — notification team + auto-response
- [x] Cookie consent banner (GDPR)

## ✅ Phase 2 — CRM Dashboard

- [x] Route protégée `/dashboard` avec Clerk
- [x] Layout dashboard (sidebar navigation)
- [x] Page `Contacts` : DataTable listant les soumissions
- [x] Page `Contact/[id]` : détail d'une soumission
- [x] Dashboard home page : KPIs (total candidates, pipeline, placed, contacts) + bar chart statuts + recent activity

## ✅ Phase 3 — Pipeline de recrutement (Kanban)

- [x] Table `candidates` avec statuts (Neue Bewerbung → Gestartet) + position ordering
- [x] Page `Candidates` : Kanban board drag & drop avec @dnd-kit
- [x] Page `Candidate/[id]` : profil, statut, notes éditable
- [x] Mutations : `create`, `updateStatus`, `updatePositions`, `updateNotes`, `remove`
- [x] Requêtes : `list`, `getByStatus`, `getById`, `getDashboardStats`
- [x] Animations enter/exit (framer-motion AnimatePresence)
- [x] DragOverlay width fix (ResizeObserver)
- [x] Search bar avec icône centrée
- [x] Design polish : font-heading, brand colors, opacités, fond gradient
- [x] Empty states par colonne
- [x] React.memo sur KanbanCard (comparateur deep)
- [x] Mobile responsive (padding/gap variables)
- [x] Status colors harmonisées page détail ↔ kanban

## ✅ Phase 4 — Documents & suivi

- [x] Ajout tables `documents` + `activityLog` au schema Convex
- [x] Upload fichiers CV, Zeugnisse via Convex file storage (génération URL, upload, save)
- [x] Timeline d'activité par candidat (création, changement statut, notes, uploads)
- [x] Page `Documents` : liste de tous les documents uploadés + lien candidat
- [x] Upload UI sur la page détail candidat (type selector + file input)
- [x] Timeline visuelle sur la page détail candidat
- [x] Sidebar link vers Documents
- [x] Export CSV des candidats (route API `/api/export-candidates`)
- [x] Nettoyage cascade à la suppression d'un candidat (docs + logs)

## 📋 Phase 5 — Améliorations & déploiement

- [x] Templates email bilingues (DE/EN) — auto-response + notification team via Resend
- [x] Accessibilité (keyboard nav, screen reader, focus styles, aria-live, skip link)
- [x] Page 404 personnalisée (`app/not-found.tsx`)
- [x] Error boundaries pour le dashboard
- [x] Rate limiting sur le formulaire contact (Convex: 5min/email, 10/min global)
- [x] Sidebar shadcn (collapsible icon mode, logo SVG quand replié)
- [x] Table `users` + rôles (admin/editor/viewer) — webhook Clerk → Convex + seeding via `CLERK_ADMIN_EMAIL`
- [x] Page `/dashboard/users` (admin only) — gestion des rôles
- [x] Dashboard caché (404 pour utilisateurs non authentifiés via middleware)
- [ ] Notifications en temps réel via Convex subscriptions
- [ ] Tests E2E (Playwright ou Cypress)
- [ ] Déploiement production (Vercel)
- [ ] Analytics (Plausible ou Vercel Analytics)
