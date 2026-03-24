# ONUtech Plateform

Application web React/Vite pour présenter ONUtech, proposer un assistant Q/A et gérer une galerie de réalisations avec une carte de localisation.

## Aperçu fonctionnel

- **Accueil & Q/A** : saisie d’un prompt, suggestions rapides, affichage d’une réponse côté UI.
- **Galerie des réalisations** : liste filtrable par catégories, création/édition/suppression via modale (accès restreint par email).
- **Localisation** : affichage d’une carte Leaflet avec itinéraire vers la destination.
- **Google One Tap** : intégration de Google Identity pour récupérer les infos utilisateur.

## Stack technique

- **React 19 + Vite**
- **TypeScript (mix TS/JS)**
- **Tailwind CSS 4**
- **React Router**
- **TanStack Query**
- **Leaflet / React-Leaflet**
- **React Toastify**

## Lancer le projet

```bash
npm install
npm run dev
```

## Configuration (.env)

Variables utilisées côté front (préfixées `VITE_`).

```bash
VITE_API_URL=https://api.example.com
VITE_CLIENT_GOOGLE_APPS=xxx.apps.googleusercontent.com
VITE_EMAIL1=admin@example.com
```

## Architecture (principaux fichiers)

### Entrée de l’application

- [`src/main.jsx`](src/main.jsx:1) : bootstrap React, router, React Query.
- [`src/App.jsx`](src/App.jsx:1) : routes principales, redirection vers `/home`.

### Page principale

- [`src/pages/HomeScreen.tsx`](src/pages/HomeScreen.tsx:1)
  - Gère l’état utilisateur Google, le prompt, l’affichage de réponse.
  - Ouvre les modales de localisation et de galerie.

### Composants UI

- [`src/components/Header.tsx`](src/components/Header.tsx:1) : header fixe, accès aux modales.
- [`src/components/PromptInput.tsx`](src/components/PromptInput.tsx:1) : textarea auto‑résizable + bouton d’envoi.
- [`src/components/Response.tsx`](src/components/response.tsx:1) : carte d’affichage question/réponse.
- [`src/components/SuggestionChips.tsx`](src/components/SuggestionChips.tsx:1) : suggestions rapides.
- [`src/components/banner.tsx`](src/components/banner.tsx:1) : bandeaux animés (WavyMarquee).

### Modales

- [`src/components/modals/Maps.tsx`](src/components/modals/Maps.tsx:1) : modale carte Leaflet.
- [`src/components/modals/Galerie.tsx`](src/components/modals/Galerie.tsx:1) : modale galerie, filtres, actions.
- [`src/components/modals/FormRealisation.tsx`](src/components/modals/FormRealisation.tsx:1) : formulaire création/édition.

### Données & Hooks API

- [`src/api/client.tsx`](src/api/client.tsx:1) : wrapper `fetch` basé sur `VITE_API_URL`.
- [`src/hooks/chatbot.tsx`](src/hooks/chatbot.tsx:1) : mutation `/api/v1/ask`.
- [`src/hooks/realisation.tsx`](src/hooks/realisation.tsx:1) : CRUD `/api/v1/realisation`.
- [`src/hooks/category.tsx`](src/hooks/category.tsx:1) : lecture `/api/v1/category`.

### Carte (Leaflet)

- [`src/api/Maps.tsx`](src/api/Maps.tsx:1)
  - Récupère la géolocalisation.
  - Calcule un itinéraire via l’API OSRM.
  - Affiche destination + route sur un fond satellite.

## Flux principaux

### Q/A

1. L’utilisateur saisit un prompt ou clique une suggestion.
2. Mutation `useAskQuestion` vers `/api/v1/ask`.
3. Affichage de la réponse dans [`Response`](src/components/response.tsx:1).

### Galerie

1. Ouverture de la modale via le header ou suggestion.
2. Chargement des réalisations et catégories.
3. Filtrage par catégorie et gestion CRUD via modale de formulaire.

## Scripts disponibles

- `npm run dev` : lance le serveur Vite
- `npm run build` : build production
- `npm run preview` : preview du build
- `npm run lint` : linting

## Notes

- Les actions de création/édition/suppression sont conditionnées par l’email `VITE_EMAIL1`.
- Le routage côté front redirige `"/"` vers `"/home"`.
