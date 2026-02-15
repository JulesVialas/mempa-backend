/**
 * playlistRoutes.js                05/02/2026
 * MIAGE de Toulouse, pas de copyright
 */

const express = require('express');
const router = express.Router();
const playlistCtrl = require('../controllers/playlistController');

/** Routes publiques */
router.get('/', playlistCtrl.getAll);
router.get('/:id', playlistCtrl.getById);
router.get('/:id/morceaux', playlistCtrl.getContenu);

/** Exportation du routeur */
module.exports = router;