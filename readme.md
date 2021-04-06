# Go Fullstack avec Node.js Express et MongoDB

[TOC]

## Créez un serveur Express simple

### Installation et prérequis

Sur macOS je prend le partie d'utiliser [Homebrew](https://brew.sh/index_fr) comme gestionaire de paquet ([repo GitHub](https://github.com/Homebrew/brew)).

#### Rappel de l'installation de Homebrew

/!\ get Xcode before and then :

```bash
/usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
```

#### Installation de nodeJS and NMP

```bash
brew install node
```

#### Installation d'Angular

```bash
brew install angular-cli
```

Pour lancer la runtime Angular : `ng serve` depuis le dossier `frontend`.

#### Installer `nodemon`

Afin de remettre à jour notre serveur à chaque modification de nos fichiers durant le développement, `nodemon` est l'outil indispensable.

```bash
npm install -g nodemon
```

Au lieu de lancer `node server` dans le dossier `backend` on lancera `nodemon server`.

### Demarrer un serveur backend

Dans le dossier backend :

- Executer `mpm init`, determiné comme entry point le fichier `server.js`, créer le fichier `server.js`.
- Dans ce même dossier créer un fichier `.gitignore` contenant la ligne `node_modules`.
- Installer express

```bash
npm install express --save
```

L'argument `--save` permet d'ajouter express à `package.json`.

### Créer une route `'GET'`

Principe de fonctionnement d'une API : __CRUD__
__C__ reate => (Créer)
__R__ ead => (Lire)
__U__ pdate => (Modifier)
__D__ elete => (Supprimer)

__C__ ross
__O__ rigin
__R__ essource
__S__ haring

### Créer une route 'POST'

## Créer une API RESTful

### Installation MongoDB

Créer un cluster et une DB sur le site de MongoDB,
Installer `mongoose` a partir du dossier `backend`

```bash
npm install --save mongoose
````

Dans `app.js` :

```javascript
const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://[USERNAME:PASSWORD]@cluster0.ejgiy.mongodb.net/[DATABASE_NAME]?authSource=admin&replicaSet=atlas-6bscut-shard-0&readPreference=primary&appname=MongoDB%20Compass&ssl=true',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));
```

Remplacer les infos entre `[ ]` en supprimant les crochets.

Mongoose = schémas de données.

### Utilisation de MongoDB et Mongoose

#### Créer un schéma de données

Dans le dossier `backend` créer un dosssier `models` puis créer un fichier `thing.js`.

Création du schéma de données qui contient les champs souhaités pour chaque `Thing` (title, description, etc) en indiquant le type et si besoin l'obligation ou non de saisir se champ.

```javascript
const mongoose = require('mongoose');

const thingSchema = mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  imageUrl: { type: String, required: true },
  userId: { type: String, required: true },
  price: { type: Number, required: true },
});

module.exports = mongoose.model('Thing', thingSchema);
```

Pas nécéssité de créer le champ `_id` car mongoose en generera un.
Puis on exporte notre schéma `Thing` pour le rendre dispo dans l'application Express.

#### Enregistrement et récupération des données

##### Enregistrement dans la base de données

Dans `app.js` :

1. Importer node modele mongoose :

    ```javascript
    const Thing = require ('./models/thing');
    ```

1. Changer la route `'POST'`

    ```javascript
    app.post('/api/stuff', (req, res, next) => {
        delete req.body._id;
        const thing = new Thing({
            ...req.body
        });
        thing.save()
            .then(() => res.status(201).json({message: 'Objet enregistré !'}))
            .catch(error => res.status(400).json({error}));
    });
    ```

On crée une instance du modèle `Thing` et lui passant un objet JavaScript contenant toutes les informations requise du corps de la requête (au préalable, on supprime l'`_id` qui est généré par le frontend).

On utilise un opérateur spread : `...`. Il permet d'éviter de saisir chaques éléments de notre `Thing` sous la forme :

```javascript
const thing = new Thing({
    title           : req.body.title,
    description     : req.body.description,
    imageUrl        : req.body.imageUrl,
    userId          : req.body.userId,
    price           : req.body.price,
});
```

On utilise la méthode `save()` qui renvois une promise, donc `then()` et `catch()`.

##### Récuperation de la listes de données

Modification de la route `'GET'` :

On peut remplacer le `app.use();` par `app.get();` afin qu'il ne réagisse qu'on requête `'GET'`.

```javascript
app.get('/api/stuff', (req, res, next) => {
    Thing.find()
        .then(things => res.status(200).json(things))
        .catch(error => res.status(400).json({error}));
});
```

On utilise la méthode `find()` pour qu'elle nous renvoie le tableau contenant tous les `Things`.
Si on clique sur un des `Things`, nous n'avons pas encore le détail qui s'affiche, il faut implèmenter une route.

##### Récuperation d'un élément spécifique

On utilise toujours la méthode `'GET'` mais on va lègérement modifier le ENDPOINT. On utilise les `:` pour dire que l'on va changer dynamiquement le paramètre qui suit. Le paramètre sera `id`.

On va utiliser `findOne()` au lieu de `fin()`.
`req.params.id` est un paramètre de route dynamique.

```javascript
app.get('/api/stuff/:id', (req, res, next) => {
    Thing.findOne({_id: req.params.id})
    .then(thing => res.status(200).json(thing))
    .catch(error => res.status(404).json({error}));
});
```

`findOne()` nous retourne une promise.

#### Modification et suppression de données

##### Modification

Pour modifier une DB on utilise la route `'PUT'` en utilsant la méthode `updateOne(arg1, arg2)`.

- `arg1` : sera l'`id` de l'élément que l'on souhaite modifier.
- `arg2` : sera en deux partis `(arg21, arg22)`.
  - `arg21` : sera le schéma a utiliser
  - `arg22` : sera le même `id` que `arg1` afin de dire que c'est bien lui et non un nouveau qu'on modifie.

```javascript
app.put('/api/stuff/:id', (req, res, next) => {
    Thing.updateOne({ _id: req.params.id }, { ...req.body, _id: req.params.id })
        .then(() => res.status(200).json({ message: 'Objet modifié !'}))
        .catch(error => res.status(400).json({ error }));
});
```

##### Suppression

Pour supprimer un élément on va utiliser la route `'DELETE'` suivant les mêmes modalités aue précédement.

```javascript
app.delete('/api/stuff/:id', (req, res, next) => {
    Thing.deleteOne({ _id: req.params.id })
        .then(() => res.status(200).json({ message: 'Objet supprimé !'}))
        .catch(error => res.status(400).json({ error }));
});
```

#### En résumé partie 1

Notre __CRUD__ est complet.

- configurer une base de donnée __MongoDB__ et la connecter à __Express__
- utilsation de __Mongoose__ pour créer un modèle afin de facilité les opérations de la base de donnée.
- implémentation dans __Express__ des routes __CRUD__ qui exploitent notre modèle de données __Mongoose__ afin de rendre notre application dynamiaue.

## Mettre en place un système d'authentification sur votre application

### Optimiser la structure back-end

On va scinder le fichier `app.js` en séparant les routes ('GET', 'POST', etc) des controleurs (logique métier) afin d'allèger le code de `app.js` et en facilité la maintenance.

Ainsi nous allons créer l'arborescence suivante :

```bash
|backend
    |_controllers
        |_stuff.js
    |_routes
        |_stuff.js
```

#### Au final nous aurons

##### dans `/routes/stuff.js`

```javascript
const express = require('express');
const router = express.Router();

const stuffCtrl = require('../controllers/stuff');

router.get('/', stuffCtrl.getAllThings);
router.post('/', stuffCtrl.createThing);
router.get('/:id', stuffCtrl.getOneThing);
router.put('/:id', stuffCtrl.modifyThing);
router.delete('/:id', stuffCtrl.deleteThing);

module.exports = router;
```

##### dans `/controllers/stuff.js`

```javascript
const Thing = require('../models/thing');

exports.getAllThings = (req, res, next) => {
  Thing.find().then(
    (things) => {
      res.status(200).json(things);
    }
  ).catch(
    (error) => {
      res.status(400).json({
        error: error
      });
    }
  );
};

exports.createThing = (req, res, next) => {
  const thing = new Thing({
    title: req.body.title,
    description: req.body.description,
    imageUrl: req.body.imageUrl,
    price: req.body.price,
    userId: req.body.userId
  });
  thing.save().then(
    () => {
      res.status(201).json({
        message: 'Post saved successfully!'
      });
    }
  ).catch(
    (error) => {
      res.status(400).json({
        error: error
      });
    }
  );
};

exports.getOneThing = (req, res, next) => {
  Thing.findOne({
    _id: req.params.id
  }).then(
    (thing) => {
      res.status(200).json(thing);
    }
  ).catch(
    (error) => {
      res.status(404).json({
        error: error
      });
    }
  );
};

exports.modifyThing = (req, res, next) => {
  const thing = new Thing({
    _id: req.params.id,
    title: req.body.title,
    description: req.body.description,
    imageUrl: req.body.imageUrl,
    price: req.body.price,
    userId: req.body.userId
  });
  Thing.updateOne({_id: req.params.id}, thing).then(
    () => {
      res.status(201).json({
        message: 'Thing updated successfully!'
      });
    }
  ).catch(
    (error) => {
      res.status(400).json({
        error: error
      });
    }
  );
};

exports.deleteThing = (req, res, next) => {
  Thing.deleteOne({_id: req.params.id}).then(
    () => {
      res.status(200).json({
        message: 'Deleted!'
      });
    }
  ).catch(
    (error) => {
      res.status(400).json({
        error: error
      });
    }
  );
};
```

##### /!\ ne pas oublier d'ajouter nos routes dans `app.js`

```javascript
//en tête de fichier
const stuffRoutes = require('./routes/stuff');

//en pied de fichier
app.use('/api/stuff', stuffRoutes);
```

##### Preparer la base de donnée pour les information d'authentification

##### Création d'un nouveau modèle `/models/user.js`

```javascript
const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = mongoose.Schema({
    email       : {type: String, required: true, unique: true},
    password    : {type: String, required: true}
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);
```

La propriété `unique` evite de créer un identifiant avec un email déjà utilisé.
Cependant, les erreurs de MongoDB sont parfois difficile à interprèter, nécéssité du paquet `mongoose-unique-validator`.

```bash
npm install --save mongoose-unique-validator
```

#### Créer des utilisateurs

##### Nous allons créer

###### `/routes/user.js`

```javascript
const express = require('express');
const router = express.Router();

const userCtrl = require('../controllers/user');

router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login);

module.exports = router;
```

###### `/controllers/user.js`

Nous aurons d'abord besoin du paquet `bcrypt` : `npm install --save bcrypt`.
Documentation de [BCRYPT](https://www.npmjs.com/package/bcrypt).

```javascript
const bcrypt = require('bcrypt');
const User = require('../models/user');


exports.signup = (req, res, next) => {
    bcrypt.hash(req.body.password, 10)
        .then(hash => {
            const user = new User({
                email   : req.body.email,
                password: hash
            });
            user.save()
                .then(() => res.status(201).json({message: 'Utilisateur créé !'}))
                .catch(error => res.status(400).json({error}))
        })
        .catch(error => res.status(500).json({error}));
};

exports.login = (req, res, next) => {

};
```

##### /!\ Encore une fois ne pas oublier d'ajouter nos routes dans `app.js`

```javascript
//en tête de fichier
const userRoutes = require('./routes/user');

//en pied de fichier
app.use('/api/auth', userRoutes);
```

#### Verifier les informations d'identification d'un utilisateur

##### Implémentation de la fonction login

```javascript
exports.login = (req, res, next) => {
    User.findOne({email: req.body.email})
        .then(user =>{
            if (!user){
                return res.status(401).json({error: 'utilisateur non trouvé !'});
            }
            bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                    if (!valid){
                        return res.status(401).json({error: 'Mot de passe incorrect !'})
                    }
                    res.status(200).json({
                        userId: user._id,
                        token: 'TOKEN'
                    });
                })
                .catch(error => res.status(500).json({error}));
        })
        .catch(error => res.status(500).json({error}));
};
```

Dans cette fonction :

- nous utilisons notre modèle Mongoose pour vérifier que l'e-mail entré par l'utilisateur correspond à un utilisateur existant de la base de données :
  - dans le cas contraire, nous renvoyons une erreur `401 Unauthorized` ,
  - si l'e-mail correspond à un utilisateur existant, nous continuons;

- nous utilisons la fonction `compare` de `bcrypt` pour comparer le mot de passe entré par l'utilisateur avec le hash enregistré dans la base de données :
  - s'ils ne correspondent pas, nous renvoyons une erreur `401 Unauthorized` et un message _« Mot de passe incorrect ! »_ ;
  - s'ils correspondent, les informations d'identification de notre utilisateur sont valides. Dans ce cas, nous renvoyons une réponse `200` contenant l'ID utilisateur et un _token_. Ce _token_ est une chaîne générique pour l'instant, mais nous allons le modifier et le crypter dans le prochain chapitre.

#### Créer des tokens d'authentification

```bash
npm install --save jsonwebtoken
```

##### Modifier dans `/controllers/user.js`

```javascript
//en tête de fichier
const jwt = require('jsonwebtoken');

/*
En lieu et place de la chaine de caractère 'TOKEN',
nous allons rentrer la logique suivante
en utilisant la fonction sign je jsonwebtoken (variable jwt):
*/
bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                    if (!valid){
                        return res.status(401).json({error: 'Mot de passe incorrect !'})
                    }
                    res.status(200).json({
                        userId: user._id,
                        token: jwt.sign(
                            {userId: user._id},
                            'RANDOM_TOKEN_SECRET',
                            {expiresIn: '24h'}
                        )
                    });
                })
                .catch(error => res.status(500).json({error}));
```

- Le code :

```javascript
token: jwt.sign(
    {userId: user._id},
    'RANDOM_TOKEN_SECRET',
    {expiresIn: '24h'}
)
```

- Est expliqué ci-dessous :

  - nous utilisons la fonction `sign` de `jsonwebtoken` pour encoder un nouveau _token_ ;

  - ce _token_ contient l'ID de l'utilisateur en tant que _payload_ (les données encodées dans le _token_) ;

  - nous utilisons une chaîne secrète de développement temporaire `RANDOM_TOKEN_SECRET` pour encoder notre _token_ (à remplacer par une chaîne aléatoire beaucoup plus longue pour la production) ;

  - nous définissons la durée de validité du _token_ à 24 heures. L'utilisateur devra donc se reconnecter au bout de 24 heures ;

  - nous renvoyons le _token_ au front-end avec notre réponse.

#### Impleter le _middleware_ d'authentification

Créer un dossier `middleware` avec un ficher `auth.js` :

```bash
|backend
    |_middleware
        |_auth.js
```

##### Dans `auth.js`

```javascript
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
    const userId = decodedToken.userId;
    if (req.body.userId && req.body.userId !== userId) {
      throw 'Invalid user ID';
    } else {
      next();
    }
  } catch {
    res.status(401).json({
      error: new Error('Invalid request!')
    });
  }
};
```

__Dans ce middleware :__

- étant donné que de nombreux problèmes peuvent se produire, nous insérons tout à l'intérieur d'un bloc `try...catch` ;

- nous extrayons le _token_ du header `Authorization` de la requête entrante. N'oubliez pas qu'il contiendra également le mot-clé `Bearer` . Nous utilisons donc la fonction `split` pour récupérer tout après l'espace dans le header. Les erreurs générées ici s'afficheront dans le bloc `catch` ;

- nous utilisons ensuite la fonction `verify` pour décoder notre _token_. Si celui-ci n'est pas valide, une erreur sera générée ;

- nous extrayons l'__ID utilisateur__ de notre _token_ ;

- si la demande contient un __ID utilisateur__, nous le comparons à celui extrait du _token_. S'ils sont différents, nous générons une erreur ;

- dans le cas contraire, tout fonctionne et notre utilisateur est authentifié. Nous passons l'exécution à l'aide de la fonction `next()`.

##### Modifier le fichier `/routes/stuff.js`

- importer le _middleware d'authentification_ en placant `const auth = require('../middleware/auth');` en tête de fichier.

- ajouter notre _middleware_ `auth` sur les routes que l'on souhaite protèger.

```javascript
const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');

const stuffCtrl = require('../controllers/stuff');

router.get('/', auth, stuffCtrl.getAllThings);
router.post('/', auth, stuffCtrl.createThing);
router.get('/:id', auth, stuffCtrl.getOneThing);
router.put('/:id', auth, stuffCtrl.modifyThing);
router.delete('/:id', auth, stuffCtrl.deleteThing);

module.exports = router;
```

#### En résumé partie 2

Nous avons ;

- ajouté un modèle de données `User` afin de stocker les informations utilisateur dans votre base de données ;

- implémenté le cryptage de mot de passe sécurisé afin de stocker en toute sécurité les mots de passe utilisateur ;

- créé et envoyé des _tokens_ au front-end pour authentifier les requêtes ;

- ajouté le _middleware_ d'authentification pour sécuriser les routes dans votre API. De cette façon, __seules les requêtes authentifiées seront gérées__.

## Gestion des fichiers utilisateurs sur l'API

### Accepter les fichiers entrant avec `multer`

Installer multer : `npm install --save multer`

Nous allons ajouter des éléments à notre arborescence avec un dossier `images` et un fichier `middleware/multer-config.js`:

```bash
|backend
    |images
    |_middleware
        |_multer-config.js
```

#### `multer-config.js`

```javascript
const multer = require('multer');

const MINE_TYPES = {
    'images/jpg'    : 'jpg',
    'images/jpeg'   : 'jpeg',
    'images/png'    : 'png'    
};

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, 'images')
    },
    filename: (req, file, callback) => {
        const name = file.originalname.split(' ').join('_');
        const extension = MINE_TYPES[file.minetype];
        callback(null, name + Date.now() + '.' + extension);
    }
});

module.exports = multer({storage}).single('images');
```

Dans ce _middleware_:

- __1)__ nous créons une __constante__ `storage` , à passer à `multer` comme configuration, qui contient la logique nécessaire pour indiquer à `multer` où enregistrer les fichiers entrants :

  - la fonction `destination` indique à `multer` d'enregistrer les fichiers dans le dossier `images` ;

  - la fonction `filename` indique à `multer` d'utiliser le __nom d'origine__, de __remplacer les espaces par des underscores__ et d'ajouter un __timestamp__ `Date.now()` comme nom de fichier. Elle utilise ensuite la constante dictionnaire de type MIME pour résoudre l'extension de fichier appropriée ;

- __2)__ nous exportons ensuite l'élément `multer` entièrement configuré, lui passons notre constante `storage` et lui indiquons que nous gérerons uniquement les téléchargements de fichiers image.

### Modifier les routes pour prendre en comptes les fichiers

Importer le _middleware_ dans `/routes/stuff.js` :

```javascript
//en tête de fichier
const multer = require('../middleware/multer-config')
```

#### Modifier la toute `'POST'`

Modifier la route `'POST'` dans `/routes/stuff.js` :

```javascript
router.post('/', auth, multer, stuffCtrl.createThing);
```

L'emplacement de l'appel de multer à sont importance, il parait logiaue de le placer après l'authentification.

Modifier la logiaue `'POST'` dans `/controllers/stuff.js` :

#### Modifier la toute `'PUT'`
