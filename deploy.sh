#!/bin/bash

# Arrêter l'application si elle est en cours d'exécution
pm2 stop mybingoo || true
pm2 delete mybingoo || true

# Installer les dépendances
npm install

# Générer le build de production
npm run build

# Démarrer l'application avec PM2
pm2 start ecosystem.config.js

# Sauvegarder la configuration PM2
pm2 save

# Afficher les logs
pm2 logs mybingoo
