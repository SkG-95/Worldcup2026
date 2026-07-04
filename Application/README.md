# Suivi Coupe du Monde FIFA 2026

[![CI](https://github.com/SkG-95/Worldcup2026/actions/workflows/ci.yml/badge.svg)](https://github.com/SkG-95/Worldcup2026/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](../LICENSE)
[![Déployé sur Vercel](https://img.shields.io/badge/Démo-en_ligne-000000?logo=vercel)](https://worldcup2026-two-eta.vercel.app)

**Démo en ligne : [worldcup2026-two-eta.vercel.app](https://worldcup2026-two-eta.vercel.app)**

Application web (React + Vite) de suivi de la Coupe du Monde FIFA 2026 :
consultation des matchs par phase, scores en temps réel (simulé), classements
de groupes, tableau final, et un assistant conversationnel propulsé par une
vraie IA (Google Gemini), avec repli automatique sur un mode simulé si la
clé n'est pas configurée ou en cas de coupure réseau.

## Démarrage

```bash
npm install
npm run dev
```

Puis ouvrir l'URL affichée (en général http://localhost:5173). Sans
configuration supplémentaire, l'assistant IA fonctionne en mode simulé.

### Activer la vraie IA (Google Gemini)

1. Récupérer une clé gratuite sur [aistudio.google.com/apikey](https://aistudio.google.com/apikey).
2. Copier `.env.example` en `.env.local` et renseigner `GEMINI_API_KEY`.
3. Lancer `npm run dev:vercel` (émule les fonctions serverless localement ;
   `npm run dev` seul ne sait pas exécuter `api/chat.js`).
4. En production (Vercel), ajouter `GEMINI_API_KEY` dans Project Settings →
   Environment Variables. La clé reste côté serveur, jamais exposée au client.

## Build de production

```bash
npm run build
npm run preview
```

## Tests

```bash
npm test
```

## Docker

```bash
docker compose up --build
```

Puis ouvrir http://localhost:8080.

## DevOps

Pipeline CI/CD, conteneurisation et déploiement détaillés dans
[`DEVOPS.md`](DEVOPS.md).

## Structure

- `src/data/` — données statiques (équipes, joueurs, groupes, stades, phases)
  et génération des matchs (poules + arbre à élimination directe).
- `api/chat.js` — fonction serverless (Vercel) : proxy vers l'API Gemini,
  clé lue depuis une variable d'environnement côté serveur.
- `src/services/` — couche service simulée (`worldCupApi`, pas de back-end
  serveur pour les données de matchs), quiz, et sous-dossier `ai/`
  (prédiction de match, analyse de forme simulées par logique ;
  assistant conversationnel connecté à une vraie IA via `api/chat.js`,
  avec repli simulé par mots-clés si le service est indisponible).
- `src/hooks/` — `useLiveScores`, moteur temps réel (récupération des
  matchs + polling des scores en direct).
- `src/utils/` — fonctions pures réutilisables (classements, dates, aléatoire
  à graine).
- `src/components/` — composants d'affichage (cartes de match, classements,
  tableau final, cartes FUT équipes/joueurs, assistant IA, quiz…), sans accès
  direct aux données.
- `src/styles/app.css` — charte graphique de l'application.
- `src/App.jsx` — composant racine, orchestre l'état de navigation et
  assemble les composants ci-dessus.
- `src/main.jsx` — point d'entrée React.
- `src/index.css` — reset minimal.

## Notes

- Les données de matchs proviennent d'une couche service simulée
  (`worldCupApi`), conformément au cahier des charges technique (pas de
  back-end serveur pour les données).
- L'assistant IA (`aiAssistant`) interroge une vraie IA (Google Gemini) via
  la fonction serverless `api/chat.js`, avec le contexte réel de
  l'application (scores, classements) injecté dans le prompt. Si le service
  est indisponible (clé absente, hors ligne), un repli simulé par
  mots-clés prend automatiquement le relais.
- Architecture en couches : présentation (`components/`) / logique
  applicative (`hooks/`, `utils/`) / données (`data/`, `services/`), avec
  séparation stricte de la logique métier et de l'affichage.

Projet M1-DI — ENSITECH — 2025-2026.
