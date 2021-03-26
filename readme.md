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

### Installer `nodemon`

Afin de remettre à jour notre serveur à chaque modification de nos fichiers durant le développement, `nodemon` est l'outil indispensable.

```bash
npm install -g nodemon
```

Au lieu de lancer `node server` on lancera `nodemon server`.

## Demarrer un serveur backend

Dans le dossier backend :

- Executer `mpm init`, determiné comme entry point le fichier `server.js`, créer le fichier `server.js`.
- Dans ce même dossier créer un fichier `.gitignore` contenant la ligne `node_modules`.
- Installer express

```bash
npm install express --save
```

L'argument `--save` permet d'ajouter express à `package.json`.
