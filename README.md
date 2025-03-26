# Bingoo Tombola - Plateforme de Jeux et Tirages Interactifs

Une plateforme moderne de tombola en ligne avec des fonctionnalités de paiement intégrées et un système de tirage interactif.

## Fonctionnalités

- Système de jeu interactif avec animation
- Intégration des paiements (CinetPay, PayPal, CoinPayments)
- Gestion des lots et des gains
- Système d'authentification complet
- Tableau de bord utilisateur et administrateur
- Système anti-fraude intégré

## Technologies Utilisées

- **Frontend**: Next.js 14, React, TailwindCSS
- **Backend**: Next.js API Routes
- **Base de données**: MySQL avec Prisma ORM
- **Authentification**: NextAuth.js
- **Paiements**: CinetPay, PayPal, CoinPayments

## Configuration Requise

- Node.js 18+
- MySQL

## Installation

1. Cloner le repository :
```bash
git clone https://github.com/votre-username/bingoo-tombola.git
cd bingoo-tombola
```

2. Installer les dépendances :
```bash
npm install
```

3. Créer un fichier .env avec les variables suivantes :
```env
# Base de données
DATABASE_URL="mysql://user:password@localhost:3306/bingoo_tombola"

# NextAuth
NEXTAUTH_SECRET="votre-secret-très-long"
NEXTAUTH_URL="http://localhost:3000"

# CinetPay
CINETPAY_API_KEY="votre-api-key"
CINETPAY_SITE_ID="votre-site-id"

# PayPal
PAYPAL_CLIENT_ID="votre-client-id"
PAYPAL_CLIENT_SECRET="votre-client-secret"

# CoinPayments
COINPAYMENTS_MERCHANT_ID="votre-merchant-id"
COINPAYMENTS_IPN_SECRET="votre-ipn-secret"

# Application
NEXT_PUBLIC_BASE_URL="http://localhost:3000"
```

4. Initialiser la base de données :
```bash
npx prisma db push
```

5. Démarrer le serveur de développement :
```bash
npm run dev
```

## Structure du Projet

- `/src/app` - Pages et routes de l'application
- `/src/components` - Composants React réutilisables
- `/src/lib` - Utilitaires et services
- `/prisma` - Schéma de base de données et migrations
- `/public` - Fichiers statiques

## Déploiement

1. Construire l'application :
```bash
npm run build
```

2. Démarrer en production :
```bash
npm start
```

## Déploiement avec Vercel

### Prérequis
1. Un compte Vercel
2. Le CLI Vercel installé : `npm i -g vercel`
3. Un compte Resend pour l'envoi d'emails
4. Une base de données PostgreSQL (Supabase)

### Configuration des variables d'environnement
Configurez les variables d'environnement suivantes dans votre projet Vercel :

```bash
# URL de l'application
NEXT_PUBLIC_APP_URL=https://mybingoo.reussirafrique.com

# Base de données
POSTGRES_PRISMA_URL=postgresql://...
POSTGRES_URL_NON_POOLING=postgresql://...

# Email
RESEND_API_KEY=re_...
MAIL_FROM=noreply@mybingoo.reussirafrique.com

# JWT
JWT_SECRET=votre_secret_jwt_securise
```

### Étapes de déploiement

1. Connectez-vous à Vercel :
```bash
vercel login
```

2. Liez votre projet :
```bash
vercel link
```

3. Déployez en production :
```bash
vercel --prod
```

4. Configurez le domaine personnalisé :
```bash
vercel domains add mybingoo.reussirafrique.com
```

### Configuration DNS

Ajoutez ces enregistrements DNS chez votre registrar :

```
# Pour le site
A     @     76.76.21.21
CNAME www   cname.vercel-dns.com.

# Pour les emails (Resend)
TXT   @     v=spf1 include:spf.resend.com -all
CNAME _domainkey.mybingoo  dkim.resend.com.
TXT   _dmarc.mybingoo     v=DMARC1; p=reject; sp=reject; adkim=s; aspf=s;
```

### Surveillance et maintenance

- Surveillez les performances : https://vercel.com/analytics
- Gérez les logs : https://vercel.com/dashboard/logs
- Configurez les alertes : https://vercel.com/dashboard/alerts

## Sécurité

- Toutes les routes API sont protégées par authentification
- Les mots de passe sont hashés avec bcrypt
- Protection CSRF intégrée
- Vérification des transactions pour éviter la fraude

## Contribution

Les contributions sont les bienvenues ! N'hésitez pas à ouvrir une issue ou un pull request.

## Licence

MIT
