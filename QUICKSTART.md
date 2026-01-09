# Guide de démarrage rapide

## Installation et lancement

1. **Installez les dépendances** :
```bash
npm install
```

2. **Lancez le serveur de développement** :
```bash
npm run dev
```

3. **Ouvrez votre navigateur** :
   - L'application sera disponible sur `http://localhost:5173`
   - Sur mobile, utilisez l'adresse IP de votre machine (ex: `http://192.168.1.x:5173`)

## Test sur mobile

Pour tester l'application sur votre téléphone :

1. Assurez-vous que votre téléphone et votre ordinateur sont sur le même réseau WiFi
2. Trouvez l'adresse IP de votre ordinateur :
   - Windows : `ipconfig` (cherchez IPv4)
   - Mac/Linux : `ifconfig` ou `ip addr`
3. Accédez à `http://VOTRE_IP:5173` depuis le navigateur de votre téléphone

## Fonctionnalités à tester

- ✅ Recherche d'incidents par mot-clé
- ✅ Filtres par catégorie (Ransomware, Fuite de données, Phishing)
- ✅ Filtres par niveau de menace (Faible, Moyen, Élevé, Critique)
- ✅ Design responsive mobile-first
- ✅ Thème cyber avec accents néon

## Build pour production

```bash
npm run build
```

Les fichiers optimisés seront dans le dossier `dist/` et peuvent être déployés sur n'importe quel serveur web statique.
