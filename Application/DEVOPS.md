# Architecture DevOps

Ce document décrit le pipeline d'intégration et de livraison continue mis en
place pour l'application, en complément du cahier des charges technique.

## 1. Vue d'ensemble

```
Développeur ──push/PR──▶ GitHub ──▶ CI (GitHub Actions) ──▶ Vercel (CD)
                                        │
                                        ├─ npm ci
                                        ├─ eslint (analyse statique)
                                        ├─ vitest (tests unitaires)
                                        ├─ npm audit (sécurité, non bloquant)
                                        └─ vite build (build de production)
```

L'objectif est qu'aucun code non testé, non lint, ou qui ne compile pas ne
puisse atteindre la branche `main`, et que la mise en production soit
automatique et reproductible.

## 2. Intégration continue (CI)

Fichier : [`.github/workflows/ci.yml`](.github/workflows/ci.yml)

Déclenchée à chaque `push` et `pull request` vers `main`. Étapes :

1. Récupération du code (`actions/checkout`).
2. Installation de Node.js 20 avec cache npm.
3. `npm ci` — installation reproductible à partir de `package-lock.json`.
4. `npm run lint` — analyse statique ESLint (bloquant).
5. `npm test` — tests unitaires Vitest (bloquant).
6. `npm audit --audit-level=high` — audit de sécurité des dépendances
   (informatif, non bloquant : signalé sans interrompre le pipeline).
7. `npm run build` — build de production Vite.
8. Archivage du dossier `dist/` en artefact téléchargeable.

Les mises à jour de dépendances sont proposées automatiquement chaque
semaine via [Dependabot](.github/dependabot.yml) (npm et GitHub Actions).

## 3. Tests automatisés

La logique métier pure (classements, prédiction IA, analyse de forme,
génération du quiz, aléatoire à graine) est couverte par des tests
unitaires Vitest, exécutés en CI à chaque changement :

- `src/utils/standings.test.js`
- `src/utils/random.test.js`
- `src/services/ai/predictMatch.test.js`
- `src/services/ai/analyzeTeam.test.js`
- `src/services/quiz.test.js`

```bash
npm test          # exécution unique (CI)
npm run test:watch  # mode watch (développement)
```

## 4. Qualité avant commit (hooks Git)

Un hook `pre-commit` (Husky + lint-staged) relance ESLint sur les fichiers
JavaScript/JSX modifiés avant chaque commit, afin de ne jamais versionner de
code en échec de lint. Le hook est versionné dans `Application/.husky/` et
partagé par toute l'équipe via Git (pas de configuration locale manuelle).

## 5. Conteneurisation

Fichiers : [`Dockerfile`](Dockerfile), [`docker-compose.yml`](docker-compose.yml)

Image Docker en deux étapes (multi-stage build) :

1. **build** (`node:20-alpine`) — installation des dépendances et
   `npm run build`.
2. **runtime** (`nginx:1.27-alpine`) — sert uniquement le résultat statique
   (`dist/`), avec une configuration nginx dédiée aux applications mono-page
   (SPA) et un `HEALTHCHECK`.

```bash
docker compose up --build   # démarre l'application sur http://localhost:8080
```

Cette approche garantit un environnement d'exécution identique en local, en
CI et en production, indépendamment de la machine hôte.

## 6. Déploiement continu (CD)

L'application est déployée sur **Vercel**, connecté directement au dépôt
GitHub (`vercel.json` à la racine de `Application/`) :

- Chaque push sur `main` déclenche un déploiement de production automatique.
- Chaque pull request génère un déploiement de prévisualisation isolé.
- HTTPS est fourni automatiquement par la plateforme (répond à l'exigence de
  communications sécurisées du cahier des charges technique).

## 7. Sécurité opérationnelle

- Aucune clé d'API ni secret dans le code client (cohérent avec l'absence de
  back-end serveur — voir cahier des charges technique).
- Dépendances auditées automatiquement (`npm audit` en CI + Dependabot).
- `.dockerignore` et `.gitignore` excluent les artefacts et fichiers locaux
  sensibles du build et du dépôt.

## 8. Évolutions possibles

- Ajout d'un outil de suivi d'erreurs runtime (ex. Sentry) si l'application
  évolue vers un vrai back-end.
- Bascule du polling temps réel vers WebSocket, sans changement d'architecture
  côté déploiement (voir cahier des charges technique).
