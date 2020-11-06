const express = require('express');
const router = express.Router(); //méthode router de express

const auth = require('../middleware/auth');  //importation de l'authentification
const multer = require('../middleware/multer-config');   //importation multer pour gestions d'images
const sauceCtrl = require('../controllers/sauces'); //importation des controllers sauces


router.get('/', auth, sauceCtrl.getAllSauces);
router.post('/', auth, multer, sauceCtrl.createSauce);
router.get('/:id', auth, sauceCtrl.getOneSauce);
router.put('/:id', auth, multer, sauceCtrl.modifySauce);
router.delete('/:id', auth, sauceCtrl.deleteSauce);
router.post('/:id/like', auth, sauceCtrl.reactToSauce);

module.exports = router;