# Cybnews

Application React.js moderne pour suivre les incidents de cybersécurité mondiaux. Design Mobile First avec thème Cyber.

## 🚀 Fonctionnalités

- 📋 **Liste des incidents** : Affichage de tous les incidents de cybersécurité avec leurs détails
- 🔍 **Recherche en temps réel** : Barre de recherche pour filtrer les incidents par titre, source ou résumé
- 🎯 **Filtres par catégorie** : 
  - Ransomware
  - Fuite de données
  - Phishing
- ⚠️ **Filtres par niveau de menace** :
  - Faible
  - Moyen
  - Élevé
  - Critique
- 🎨 **Design Cyber Mobile First** : Interface en mode sombre avec accents cyan/bleu électrique, optimisée pour mobile

## 🛠️ Technologies

- **React 18** - Bibliothèque UI
- **Vite** - Build tool moderne et rapide
- **Tailwind CSS** - Framework CSS utilitaire
- **Mobile First** - Design responsive optimisé pour mobile

## 📦 Installation

1. Installez les dépendances :
```bash
npm install
```

2. Lancez le serveur de développement :
```bash
npm run dev
```

3. Ouvrez votre navigateur à l'adresse affichée (généralement `http://localhost:5173`)

## 🏗️ Structure du projet

```
src/
├── components/
│   ├── IncidentCard.jsx      # Carte d'affichage d'un incident
│   ├── SearchBar.jsx          # Barre de recherche
│   ├── FilterPanel.jsx        # Panneau de filtres
│   └── EmptyState.jsx         # État vide
├── data/
│   └── incidents.js           # Données et utilitaires
├── hooks/
│   └── useIncidents.js        # Hook personnalisé pour la gestion des incidents
├── App.jsx                    # Composant principal
├── main.jsx                   # Point d'entrée
└── index.css                  # Styles globaux
```

## 🎨 Design

L'application utilise un thème cyberpunk avec :
- Fond noir (#000000)
- Accents cyan/bleu électrique
- Badges colorés pour les niveaux de menace
- Bordures néon pour les éléments interactifs
- Design Mobile First pour une expérience iOS-like sur mobile

## 📱 Mobile First

L'application est conçue avec une approche Mobile First :
- Layout optimisé pour les petits écrans
- Touch-friendly avec des zones de tap larges
- Navigation intuitive
- Performance optimisée pour mobile

## 🚀 Build pour production

```bash
npm run build
```

Les fichiers optimisés seront générés dans le dossier `dist/`.

## 📄 Licence

MIT
