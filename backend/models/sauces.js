const mongoose = require('mongoose');
const sauceValidation = require('../middleware/sauceValid');

const sauceSchema = mongoose.Schema({
  userId: { type: String, required: true },
  name: { type: String, required: true, validate : sauceValidation.nameValidator },
  manufacturer: { type: String, required: true, validate : sauceValidation.manufacturerValidator },
  description: { type: String, required: true, validate : sauceValidation.descriptionValidator },
  mainPepper: { type: String, required: true, validate : sauceValidation.pepperValidator },
  imageUrl: { type: String, required: true }, 
  heat: { type: Number, required: true, default : 0 },
  likes: { type: Number, required: false, default : 0 },
  dislikes: { type: Number, required: false, default : 0 },
  usersLiked: [{ type: String, required: false, default : [] }],
  usersDisliked: [{ type: String, required: false, default : [] }],
});

module.exports = mongoose.model('Sauce', thingSchema);