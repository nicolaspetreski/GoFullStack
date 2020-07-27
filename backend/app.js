const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const mongoose = require('mongoose');
const sauceRoutes = require('./routes/sauces');
const userRoutes = require('./routes/user');
const path = require('path');
const helmet = require('helmet');



mongoose.connect('mongodb+srv://new-user:<qweasdzxc123>@cluster0.6dlmb.mongodb.net/<dbname>?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

app.use(helmet());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*'); //accéder à notre API depuis n'importe quelle origine
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization'); //ajouter les headers mentionnés aux requêtes envoyées vers notre API
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS'); //envoyer des requêtes avec les méthodes mentionnées
  next();
});

app.use(bodyParser.json()); //avant les routes de notre application, on va utiliser encore app.use parce que ce sera pour toutes les routes de l'application et donc JSON c’est une méthode de cet objet, body-parser et c'est ce qui va transformer le corps dela requête en objet JavaScript utilisable.

app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('/api/sauces', sauceRoutes);
app.use('/api/auth', userRoutes);
module.exports = app;