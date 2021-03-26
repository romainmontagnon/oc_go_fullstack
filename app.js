const express = require('express');

const app = express();

app.use((req, res, next) => {
    console.log('requete reçu');
    next();
});

app.use((req, res, next) => {
    res.status(201);
    next();
});

app.use((req, res, next) => {
    res.json({message: 'Votre requetes a bien été recue !'});
    next();
});

app.use((req, res)=> {
    console.log('Reponse envoyée avec succés !!');
});

module.exports = app;