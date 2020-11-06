const bcrypt = require('bcrypt');
const jwt = require ('jsonwebtoken');
const mailValidator = require('email-validator'); // Plugin pour validation email regex
const passwordValidator = require('password-validator'); //Plugin pour validation de mdp
const User = require('../models/user'); //importation du model User
var schema = new passwordValidator();

schema
.is().min(8)  // Au minimum 8 characteres
.is().max(30) // Au max 30 characteres
.has().not().spaces();  // Le mdp ne peut avoir d'espaces

exports.signup = (req, res, next) => {  //cryptage du mot de passe
  if (!mailValidator.validate(req.body.email) || (!schema.validate(req.body.password))) {
      throw { error: "Merci de bien vouloir entrer une adresse email et un mot de passe valide !" }
  } else if (mailValidator.validate(req.body.email) && (schema.validate(req.body.password))) {
  bcrypt.hash(req.body.password, 10) //creation user et enregistrement dans le base de donnée
      .then(hash => {
          const user = new User({
              email: req.body.email,
              password: hash
          });
          user.save()
              .then(() => res.status(201).json({ message: 'User created !'}))
              .catch(error => res.status(400).json({ error }));
      })
      .catch(error => res.status(500).json({ error: 'Votre mot de passe doit faire entre 8 et 30 caractères et ne peut pas contenir un espace' }));
  }
};

exports.login = (req, res, next) => { //chercher l'adresse mail dans la base de donnée
    User.findOne({ email: req.body.email })
      .then(user => { //si l'utilisateur n'est pas dans la base de donnée
        if (!user) {
          return res.status(401).json({ error: 'Utilisateur non trouvé !' });
        }  //si l'utilisateur est trouvé alors vérification du mot de passe crypté
        bcrypt.compare(req.body.password, user.password)
          .then(valid => { //si le mot de passe ne correspond pas
            if (!valid) {
              return res.status(401).json({ error: 'Mot de passe incorrect !' });
            }
            //si le mot de passe corrsepond alors création d'un token d'identification
            res.status(200).json({
                userId: user._id,
                //création d'un token
                token: jwt.sign(
                  { userId: user._id },
                  'RANDOM_TOKEN_SECRET',
                  { expiresIn: '24h' } //valable 24h
                )
            }); 
          })
          .catch(error => res.status(500).json({ error }));// erreur serveur
      })
      .catch(error => res.status(500).json({ error })); // erreur serveur
};