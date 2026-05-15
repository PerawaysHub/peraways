# PeraWays — Plan de refonte (Convex + Clerk + Resend)

## Phase 1 — Foundation (Convex + formulaire fiable)

- [ ] Installer `convex` + `@resend/react-email` (ou resend SDK)
- [ ] Configurer Convex : `npx convex dev`
- [ ] Définir le schema Convex :
  - `contacts` table (soumissions formulaire)
  - `candidates` table (CRM)
  - `users` table (lien avec Clerk)
- [ ] Mutation `sendContactForm(name, email, telefon, nachricht, lang)`
  - Sauvegarde dans `contacts`
  - Envoie notification email à team@peraways.de via Resend
  - Envoie auto-response au demandeur via Resend
- [ ] Remplacer `Form.tsx` : appeler la mutation Convex au lieu du fetch GAS
- [ ] Supprimer `scripts/apps-script.gs`
- [ ] Supprimer `.env.local` → utiliser `npx convex env` ou `.env.local` côté Convex
- [ ] Templates email HTML bilingues (DE/EN) avec react-email

## Phase 2 — CRM Dashboard (lecture)

- [ ] Route protégée `/dashboard` avec Clerk (`<Protect>`)
- [ ] Layout dashboard (sidebar navigation)
- [ ] Page `Contacts` : tableau listant les soumissions du formulaire
- [ ] Page `Contact/[id]` : détail d'une soumission
- [ ] Filtrer / rechercher dans les contacts

## Phase 3 — Pipeline de recrutement

- [ ] Ajouter statuts dans `candidates` table :
  - `Neue Bewerbung` → `Kontaktiert` → `Gespräch` → `Angebot` → `Visum` → `Gestartet`
- [ ] Page `Candidates` : Kanban board (drag & drop) ou tableau + filtres
- [ ] Page `Candidate/[id]` : profil, infos, statut, notes
- [ ] Mutation `updateStatus(candidateId, newStatus)`
- [ ] Mutation `addNote(candidateId, note)`
- [ ] Query `getCandidatesByStatus(status)` pour le Kanban

## Phase 4 — Documents & suivi

- [ ] Upload fichiers CV, Zeugnisse via `convex/file-storage`
- [ ] Timeline d'activité par candidat (changement statut, notes, uploads)
- [ ] Page `Documents` : liste des documents uploadés
- [ ] Export CSV des candidats

## Phase 5 — Améliorations

- [ ] Templates email personnalisables depuis le dashboard
- [ ] Stats / analytics (nombre de candidats par statut, temps moyen par étape)
- [ ] Notifications en temps réel via Convex subscriptions
- [ ] Tests E2E (Cypress ou Playwright)
- [ ] Déploiement production (Vercel)
