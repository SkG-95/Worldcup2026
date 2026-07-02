# Suivi Coupe du Monde FIFA 2026

Application web (React + Vite) de suivi de la Coupe du Monde FIFA 2026 :
consultation des matchs par phase, scores en temps réel (simulé), classements
de groupes, tableau final, et un assistant conversationnel (mode simulé,
sans clé API).

## Démarrage

```bash
npm install
npm run dev
```

Puis ouvrir l'URL affichée (en général http://localhost:5173).

## Build de production

```bash
npm run build
npm run preview
```

## Structure

- `src/data/` — données statiques (équipes, joueurs, groupes, stades, phases)
  et génération des matchs (poules + arbre à élimination directe).
- `src/services/` — couche service simulée (`worldCupApi`, pas de back-end
  serveur), quiz, et sous-dossier `ai/` (prédiction de match, analyse de
  forme, assistant conversationnel — toutes simulées par logique/mots-clés,
  remplaçables par un vrai appel API sans toucher à l'affichage).
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

- Les données proviennent d'une couche service simulée (`worldCupApi`),
  conformément au cahier des charges technique (pas de back-end serveur).
- L'assistant IA répond à partir des données réelles de l'application via
  une logique simulée par mots-clés (`aiAssistant`), remplaçable par un
  vrai appel API sans toucher à l'affichage.
- Architecture en couches : présentation (`components/`) / logique
  applicative (`hooks/`, `utils/`) / données (`data/`, `services/`), avec
  séparation stricte de la logique métier et de l'affichage.

Projet M1-DI — ENSITECH — 2025-2026.
