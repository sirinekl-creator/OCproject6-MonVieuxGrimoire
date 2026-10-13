# Mon Vieux Grimoire 📚

**Projet OpenClassrooms — Formation Développeur Web**

Développement du back-end d'un site de référencement et de notation de livres pour une chaîne de librairies fictive, **Le Vieux Grimoire**, située à Lille.

## Présentation du projet

Mon Vieux Grimoire est une application web permettant aux utilisateurs de consulter des livres, d'en ajouter, de les modifier et de leur attribuer une note.

Dans le cadre de ce projet, le **front-end en React était fourni par OpenClassrooms**. Ma mission consistait à développer une API REST avec Node.js, Express et MongoDB, puis à l'intégrer au front-end existant.

## Fonctionnalités développées

- Inscription et connexion des utilisateurs.
- Authentification sécurisée avec JSON Web Token (JWT).
- Gestion des livres : création, consultation, modification et suppression (CRUD).
- Vérification des autorisations pour modifier ou supprimer un livre.
- Attribution d'une note de 0 à 5 à un livre, une seule fois par utilisateur.
- Calcul automatique de la note moyenne.
- Récupération des trois livres les mieux notés.
- Téléversement, optimisation et suppression des images de couverture.

## Technologies utilisées

### Back-end
- **Node.js** — Environnement d'exécution JavaScript.
- **Express.js** — Création du serveur et des routes de l'API.
- **MongoDB Atlas** — Base de données NoSQL.
- **Mongoose** — Modélisation et validation des données.
- **JWT** — Authentification des utilisateurs.
- **bcrypt** — Hachage des mots de passe.
- **Multer** — Gestion du téléversement des images.
- **Sharp** — Optimisation des images.

### Front-end
- **React** — Interface utilisateur fournie pour le projet.

## Architecture du back-end

Le back-end suit une organisation inspirée de l'architecture **MVC (Modèle-Vue-Contrôleur)** :

- `models/` : schémas Mongoose des utilisateurs et des livres.
- `controllers/` : logique métier de l'application.
- `routes/` : définition des endpoints de l'API.
- `middleware/` : authentification et gestion des images.
- `images/` : stockage local des couvertures.

La partie Vue est assurée par le front-end React.

## Sécurité

Plusieurs mesures ont été mises en place :

- Hachage des mots de passe avec bcrypt.
- Authentification par JWT.
- Protection des routes nécessitant une connexion.
- Vérification de l'identité du propriétaire avant modification ou suppression d'un livre.
- Validation des données avec Mongoose.
- Limitation de la taille et des formats des images envoyées.
- Protection des informations sensibles grâce aux variables d'environnement.

## Green Code et optimisation des images

Afin de limiter le poids des fichiers stockés et transférés, les images de couverture sont optimisées avec **Sharp** :

- Redimensionnement maximal à **800 × 800 pixels**, sans agrandissement inutile.
- Conversion au format **WebP**.
- Compression avec une qualité de **80 %**.
- Suppression des fichiers temporaires après optimisation.

Cette démarche contribue à réduire l'espace de stockage utilisé et le volume de données transférées.

## Installation et lancement

### Prérequis

- Node.js 22 ou version supérieure
- npm
- Une base de données MongoDB Atlas

### 1. Installer le back-end

```bash
cd backend
npm install
```

Créer un fichier `.env` dans le dossier `backend` :

```env
MONGODB_URI=votre_chaine_de_connexion_mongodb
JWT_SECRET=votre_cle_secrete_jwt
```

Puis démarrer le serveur :

```bash
npm start
```

L'API est accessible par défaut à l'adresse :

`http://localhost:4000`

### 2. Installer le front-end

Dans un autre terminal :

```bash
cd frontend
npm install
npm start
```

L'application est accessible à l'adresse :

`http://localhost:3000`

## Documentation de l'API

La documentation détaillée des routes, de l'authentification et de la gestion des images est disponible dans le fichier [`backend/README.md`](backend/README.md).

## Compétences mises en pratique

- Concevoir et implémenter un modèle de données.
- Développer une API RESTful.
- Réaliser des opérations CRUD sécurisées.
- Mettre en place un système d'authentification.
- Stocker et protéger les données.
- Optimiser les images selon les principes du Green Code.
- Structurer un projet back-end avec une architecture MVC.

---

**Projet réalisé dans le cadre de la formation Développeur Web d'OpenClassrooms.**
