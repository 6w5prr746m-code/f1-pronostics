# F1 Pronostics — entre amis

Webapp où des groupes d'amis pronostiquent le podium (et le safety car)
avant chaque Grand Prix de F1, et suivent un classement de groupe en temps
réel. Zéro argent réel, zéro paris — jeu social à points.

Cahier des charges complet : [`docs/cahier-des-charges.pdf`](./docs/cahier-des-charges.pdf).

## Stack

- **Frontend/Backend**: Next.js 16 (App Router) + TypeScript + Tailwind CSS
- **Base de données / Auth**: Supabase (Postgres + Auth + RLS)
- **Hébergement cible**: Vercel

## Mise en route

1. Crée un projet sur [supabase.com](https://supabase.com).
2. Dans l'éditeur SQL du projet, exécute dans l'ordre les fichiers de
   `supabase/migrations/` (0001 → 0003), puis `supabase/seed/drivers.sql`
   pour peupler la grille de pilotes de départ.
3. Copie `.env.example` vers `.env.local` et renseigne l'URL et la clé
   anon de ton projet Supabase (Project Settings → API).
4. Dans **Authentication → URL Configuration**, ajoute
   `http://localhost:3000/auth/callback` (et l'équivalent en prod) aux
   Redirect URLs pour que le lien magique fonctionne.
5. Installe les dépendances et lance le serveur de dev :

   ```bash
   npm install
   npm run dev
   ```

6. Ouvre [http://localhost:3000](http://localhost:3000).

## Ce qui est implémenté (P0, en cours)

- [x] Inscription / connexion par lien magique (email)
- [x] Créer un groupe + code d'invitation partageable
- [x] Rejoindre un groupe via code d'invitation
- [ ] Soumettre un pronostic avant chaque course
- [ ] Verrouillage automatique des pronostics à la qualification
  (déjà imposé côté base par les policies RLS sur `predictions`, reste à
  câbler le formulaire)
- [ ] Calcul des points après chaque course
- [ ] Classement du groupe
- [ ] Vue calendrier des Grand Prix avec compte à rebours
- [ ] `/admin/results` — saisie manuelle des résultats

## Modèle de données

Voir `supabase/migrations/0001_schema.sql` pour le schéma complet
(`users`, `groups`, `group_members`, `races`, `predictions`,
`race_results`, `drivers`, `scores`) et `0003_rls.sql` pour les règles
d'accès (Row Level Security) — notamment le verrouillage automatique des
pronostics dès le début de la qualification.

## Barème de points (V1, ajustable)

| Critère | Points |
|---|---|
| Podium exact dans l'ordre | 25 |
| Pilote du podium bien placé | 10 / pilote |
| Pilote du podium présent mais mal placé | 5 / pilote |
| Safety car correctement prédit | 5 |

## Déploiement

Le plus simple : [Vercel](https://vercel.com/new), en renseignant les
mêmes variables d'environnement que `.env.local`.
