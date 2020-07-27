const bcrypt = require('bcrypt');
const jwt = require ('jsonwebtoken');
const User = require('../models/User');
const mailValidator = require('email-validator'); // Plugin pour validation email regex
const passwordValidator = require('password-validator'); //Plugin pour validation de mdp
var schema = new passwordValidator();

schema
.is().min(8)  // Au minimum 8 characteres
.is().max(30) // Au max 30 characteres
.has().not().spaces();  // Le mdp ne peut avoir d'espaces

exports.signup = (req, res, next) => {
  if (!mailValidator.validate(req.body.email) || (!schema.validate(req.body.password))) {
      throw { error: "Merci de bien vouloir entrer une adresse email et un mot de passe valide !" }
  } else if (mailValidator.validate(req.body.email) && (schema.validate(req.body.password))) {
  bcrypt.hash(req.body.password, 10)
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

exports.login = (req, res, next) => {
    User.findOne({ email: req.body.email })
      .then(user => {
        if (!user) {
          return res.status(401).json({ error: 'Utilisateur non trouvé !' });
        }
        bcrypt.compare(req.body.password, user.password)
          .then(valid => {
            if (!valid) {
              return res.status(401).json({ error: 'Mot de passe incorrect !' });
            }
            res.status(200).json({
                userId: user._id,
                token: jwt.sign(
                  { userId: user._id },
                  'RANDOM_TOKEN_SECRET',
                  { expiresIn: '24h' }
                )
            }); 
          })
          .catch(error => res.status(500).json({ error }));
      })
      .catch(error => res.status(500).json({ error }));
};