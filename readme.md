# Go Fullstack avec Node.js Express et MongoDB

[TOC]

## Installation et prérequis

Sur macOS je prend le partie d'utiliser [Homebrew](https://brew.sh/index_fr) comme gestionaire de paquet ([repo GitHub](https://github.com/Homebrew/brew)).

### Rappel de l'installation de Homebrew

/!\ get Xcode before and then :

```bash
/usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
```

### Installation de nodeJS and NMP

```bash
brew install node
```

### Installation d'Angular

```bash
brew install angular-cli
```

Pour lancer la runtime Angular : `ng serve` depuis le dossier `frontend`.

### Installer `nodemon`

Afin de remettre à jour notre serveur à chaque modification de nos fichiers durant le développement, `nodemon` est l'outil indispensable.

```bash
npm install -g nodemon
```

Au lieu de lancer `node server` dans le dossier `backend` on lancera `nodemon server`.

## Demarrer un serveur backend

Dans le dossier backend :

- Executer `mpm init`, determiné comme entry point le fichier `server.js`, créer le fichier `server.js`.
- Dans ce même dossier créer un fichier `.gitignore` contenant la ligne `node_modules`.
- Installer express

```bash
npm install express --save
```

L'argument `--save` permet d'ajouter express à `package.json`.

## Créer une route `'GET'`

Principe de fonctionnement d'une API : __CRUD__
__C__ reate => (Créer)
__R__ ead => (Lire)
__U__ pdate => (Modifier)
__D__ elete => (Supprimer)

__C__ ross
__O__ rigin
__R__ essource
__S__ haring

## Créer une route 'POST'

## Installation MongoDB

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

## Utilisation de MongoDB et Mongoose

### Créer un schéma de données

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

### Enregistrement et récupération des données

#### Enregistrement dans la base de données

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

#### Récuperation de la listes de données

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

#### Récuperation d'un élément spécifique

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

### Modification et suppression de données

#### Modification

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

#### Suppression

Pour supprimer un élément on va utiliser la route `'DELETE'` suivant les mêmes modalités aue précédement.

```javascript
app.delete('/api/stuff/:id', (req, res, next) => {
    Thing.deleteOne({ _id: req.params.id })
        .then(() => res.status(200).json({ message: 'Objet supprimé !'}))
        .catch(error => res.status(400).json({ error }));
});
```

### En résumé

Notre __CRUD__ est complet.

- configurer une base de donnée __MongoDB__ et la connecter à __Express__
- utilsation de __Mongoose__ pour créer un modèle afin de facilité les opérations de la base de donnée.
- implémentation dans __Express__ des routes __CRUD__ qui exploitent notre modèle de données __Mongoose__ afin de rendre notre application dynamiaue.

## Optimiser la structure back-end

On va scinder le fichier `app.js` en séparant les routes ('GET', 'POST', etc) des controleurs (logique métier) afin d'allèger le code et en facilité la maintenance.
