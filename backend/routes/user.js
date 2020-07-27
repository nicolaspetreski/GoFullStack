const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/user');
const bouncer = require ("express-bouncer")(9000, 600000, 3); // Anti bruteforce, ca va bloquer des connections apres 3 connections sans succes

router.post('/signup', userCtrl.signup);
router.post('/login', bouncer.block, userCtrl.login); //Utilisation du bruteforce locker et login ctrler

module.exports = router;