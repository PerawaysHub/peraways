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
- [ ] Templates email HTML bilingues (DE/EN) avec react-email
- [ ] Cookie consent banner (GDPR)

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

## 🔄 Phase 4 — Documents & suivi

- [ ] Upload fichiers CV, Zeugnisse via Convex file storage
- [ ] Timeline d'activité par candidat (changements statut, notes, uploads)
- [ ] Page `Documents` : liste des documents uploadés par candidat
- [ ] Export CSV des candidats

## 📋 Phase 5 — Améliorations & déploiement

- [ ] Templates email personnalisables depuis le dashboard
- [ ] Notifications en temps réel via Convex subscriptions
- [ ] Accessibilité (keyboard nav, screen reader, contrast)
- [ ] Page 404 personnalisée
- [ ] Error boundaries pour le dashboard
- [ ] Tests E2E (Playwright ou Cypress)
- [ ] Déploiement production (Vercel)
- [ ] Rate limiting sur le formulaire contact
- [ ] Analytics (Plausible ou Vercel Analytics)
