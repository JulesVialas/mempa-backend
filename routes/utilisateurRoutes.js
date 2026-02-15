/**
 * utilisateurRoutes.js                12/02/2026
 * MIAGE de Toulouse, pas de copyright
 */

const express = require('express');
const router = express.Router();
const utilisateurCtrl = require('../controllers/utilisateurController');

/** Routes publiques */
router.get('/', utilisateurCtrl.getAll);

/** Exportation du routeur */
module.exports = router;

