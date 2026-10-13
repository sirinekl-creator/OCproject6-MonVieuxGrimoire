# Mon Vieux Grimoire — Backend

Ce projet a été réalisé dans le cadre du parcours Développeur Web d'OpenClassrooms (Projet 6).

Il s'agit d'une API REST développée avec Node.js, Express et MongoDB.

Elle permet de :

- Créer un compte utilisateur et se connecter.
- Consulter les livres disponibles.
- Ajouter, modifier et supprimer ses propres livres.
- Noter les livres et calculer leur note moyenne.
- Récupérer les trois livres les mieux notés.
- Télécharger et optimiser les couvertures des livres au format WebP.

Le backend utilise Mongoose pour communiquer avec MongoDB, JWT pour l'authentification, Multer pour l'envoi des images et Sharp pour leur optimisation.

## Prérequis

Avant de démarrer le backend, il faut disposer de :

- **Node.js** : version 22 ou supérieure.
- **npm** : gestionnaire de paquets fourni avec Node.js.
- **MongoDB Atlas** : une base de données MongoDB accessible depuis l'ordinateur utilisé.
- **Git** : pour récupérer le projet depuis son dépôt.

Le backend fonctionne par défaut sur le port **4000**.

## Installation

1. Ouvrir un terminal à la racine du projet.
2. Accéder au dossier du backend :

   ```bash
   cd backend
   ```

3. Installer les dépendances :

   ```bash
   npm install
   ```

Cette commande installe les dépendances définies dans le fichier `package.json`.

## Configuration des variables d'environnement

Créer un fichier `.env` dans le dossier `backend` et renseigner les variables suivantes :

```env
MONGODB_URI=mongodb+srv://UTILISATEUR:MOT_DE_PASSE@ADRESSE_DU_CLUSTER/NOM_DE_LA_BASE
JWT_SECRET=remplacer_par_une_cle_secrete_longue_et_aleatoire
```

- `MONGODB_URI` : adresse de connexion à la base de données MongoDB Atlas.
- `JWT_SECRET` : clé secrète utilisée pour signer et vérifier les tokens JWT.

**Important :** le fichier `.env` contient des informations confidentielles. Il est exclu du dépôt Git grâce au fichier `.gitignore`.

La connexion à MongoDB Atlas nécessite également une configuration des accès réseau autorisés.

## Démarrage du serveur

Depuis le dossier `backend`, exécuter :

```bash
npm start
```

Cette commande démarre le serveur Node.js avec Express.

L'API est accessible par défaut à l'adresse :

`http://localhost:4000`

Pour démarrer le serveur en mode développement avec Nodemon :

```bash
npm run dev
```

Nodemon redémarre automatiquement le serveur lorsque les fichiers sont modifiés.

Le port peut être personnalisé avec la variable d'environnement `PORT`.

## Routes de l'API

### Authentification

| Méthode | Route              | Description                                      |
| ------- | ------------------ | ------------------------------------------------ |
| POST    | `/api/auth/signup` | Créer un compte utilisateur                      |
| POST    | `/api/auth/login`  | Connecter un utilisateur et obtenir un token JWT |

Les deux routes reçoivent les informations de l'utilisateur au format JSON.

Exemple de corps de requête :

```json
{
  "email": "utilisateur@exemple.com",
  "password": "mot_de_passe"
}
```

Lors d'une connexion réussie, l'API renvoie un identifiant utilisateur et un token JWT permettant d'accéder aux routes protégées.

### Gestion des livres

| Méthode | Route                   | Description                            | Authentification |
| ------- | ----------------------- | -------------------------------------- | ---------------- |
| GET     | `/api/books`            | Récupérer tous les livres              | Non              |
| GET     | `/api/books/bestrating` | Récupérer les 3 livres les mieux notés | Non              |
| GET     | `/api/books/:id`        | Récupérer un livre par son identifiant | Non              |
| POST    | `/api/books`            | Ajouter un livre                       | Oui              |
| PUT     | `/api/books/:id`        | Modifier un livre                      | Oui              |
| DELETE  | `/api/books/:id`        | Supprimer un livre                     | Oui              |
| POST    | `/api/books/:id/rating` | Noter un livre                         | Oui              |

Les routes protégées nécessitent un token JWT transmis dans l'en-tête HTTP :

```text
Authorization: Bearer <token>
```

Un utilisateur peut uniquement modifier ou supprimer les livres dont il est propriétaire.

### Gestion des images

Lors de la création d'un livre, le frontend envoie une requête au format `multipart/form-data` contenant deux champs :

- `book` : les informations du livre sous forme de chaîne JSON.
- `image` : le fichier de couverture.

Le middleware **Multer** réceptionne l'image et vérifie son format et sa taille.

La bibliothèque **Sharp** redimensionne ensuite l'image si nécessaire (800 × 800 pixels maximum, sans agrandissement) et la convertit au format **WebP**, avec une qualité de 80 %.

L'image optimisée est enregistrée dans le dossier `backend/images`, et son URL est associée au livre dans MongoDB.

Lorsqu'un livre est supprimé, son image est également supprimée du serveur.

### Système de notation

Un utilisateur connecté peut attribuer une note entière comprise entre **0 et 5** à un livre.

La notation utilise la route :

`POST /api/books/:id/rating`

Exemple de corps de requête JSON :

```json
{
  "userId": "identifiant_de_l_utilisateur",
  "rating": 4
}
```

Le token JWT doit également être transmis dans l'en-tête `Authorization`.

Les règles suivantes sont appliquées :

- Un utilisateur ne peut noter un même livre qu'une seule fois.
- La note doit être un entier entre 0 et 5.
- L'identifiant utilisateur doit correspondre à celui du token JWT.
- La moyenne `averageRating` est recalculée après chaque nouvelle note.

La route `GET /api/books/bestrating` permet de récupérer les trois livres ayant les meilleures moyennes.

## Sécurité

Plusieurs mesures de sécurité sont mises en place dans le backend :

- **bcrypt** : hachage des mots de passe avant leur enregistrement dans MongoDB.
- **JWT** : authentification des utilisateurs et protection des routes sensibles.
- **Contrôle des autorisations** : seul le propriétaire d'un livre peut le modifier ou le supprimer.
- **Mongoose** : validation des données enregistrées dans MongoDB.
- **Multer** : restriction des formats d'images acceptés et limitation de leur taille à 5 Mo.
- **Variables d'environnement** : stockage des informations sensibles dans un fichier `.env` exclu de Git.
- **mongoose-unique-validator** : vérification de l'unicité des adresses e-mail.

Ces mesures contribuent à protéger les données et à limiter les opérations non autorisées.
