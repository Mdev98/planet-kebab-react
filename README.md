# Planet Kebab React

Frontend React pour l'application de livraison Planet Kebab.

Migration moderne de l'application vanilla HTML/CSS/JS vers **React 18 + TypeScript + Vite**, prête pour le déploiement sur Vercel.

## 🚀 Technologies

- **React 18** avec **TypeScript**
- **Vite** comme build tool
- **React Router v6** pour le routing SPA
- **Zustand** pour la gestion d'état (cart + app state)
- **Axios** pour les appels API avec retry logic
- **CSS Modules** avec design system personnalisé

## 📦 Installation

### Prérequis

- Node.js 18+ et npm

### Étapes

1. Cloner le repository
```bash
git clone https://github.com/Mdev98/planet-kebab-react.git
cd planet-kebab-react
```

2. Installer les dépendances
```bash
npm install
```

3. Configurer les variables d'environnement
```bash
cp .env.example .env
```

4. (Optionnel) Ajouter les assets propriétaires
   - Copier les fichiers de polices dans `public/assets/fonts/`
   - Copier les images dans `public/assets/images/`
   - Copier les icônes dans `public/assets/icons/`
   - Voir les fichiers README dans chaque dossier pour plus de détails

5. Lancer le serveur de développement
```bash
npm run dev
```

L'application sera accessible sur `http://localhost:5173`

## 🚀 Déploiement sur Vercel

Le projet est configuré pour Vercel. Voir la section Déploiement pour plus de détails.

## 📄 Licence

Propriétaire - Planet Kebab Africa
