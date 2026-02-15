/**
 * userRoutes.js                09/02/2026
 * MIAGE de Toulouse, pas de copyright
 */

const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/userController');

/** Routes publiques */
router.get('/', userCtrl.getByPseudo);
router.post('/login', userCtrl.login);

/** Exportation du routeur */
module.exports = router;