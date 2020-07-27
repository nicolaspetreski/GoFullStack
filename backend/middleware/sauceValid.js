const validate = require('mongoose-validator');

exports.nameValidator = [
  validate({
    validator: 'isLength',
    arguments: [3, 50],
    message: 'Le nom de votre Sauce doit être entre {ARGS[0]} and {ARGS[1]} caractères',
  }),
  validate({
    validator: 'matches',
    arguments: /^[a-z\d\-_\s]+$/i,
    message: "Vous ne pouvez utiliser que des chiffres et des lettres pour nommer votre sauce",
  }),
];

exports.manufacturerValidator = [
    validate({
      validator: 'isLength',
      arguments: [3, 30],
      message: 'Le nom du fabricant doit être entre {ARGS[0]} and {ARGS[1]} caractères',
    }),
    validate({
      validator: 'matches',
      arguments: /^[a-z\d\-_\s]+$/i, 
      message: "Vous ne pouvez utiliser que des chiffres et des lettres pour nommer le fabricant",
    }),
  ];

  exports.descriptionValidator = [
    validate({
      validator: 'isLength',
      arguments: [10, 100],
      message: 'Le nom du fabricant doit être entre {ARGS[0]} and {ARGS[1]} caractères',
    }),
    validate({
      validator: 'matches',
      arguments: /^[a-z\d\-_\s]+$/i,
      message: "Vous ne pouvez utiliser que des chiffres et des lettres pour la description",
    }),
  ];

  exports.pepperValidator = [
    validate({
      validator: 'isLength',
      arguments: [2, 15],
      message: 'Le nom du fabricant doit être entre {ARGS[0]} and {ARGS[1]} caractères',
    }),
    validate({
      validator: 'isAlphanumeric',
      message: "Un seul ingrédient, en un mot s'il vous plaît",
    }),
  ];