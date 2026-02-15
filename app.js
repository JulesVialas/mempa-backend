/**
 * app.js                05/02/2026
 * MIAGE de Toulouse, pas de copyright
 */

const express = require('express');
const cors = require('cors');
const playlistRoutes = require('./routes/playlistRoutes');
const utilisateurRoutes = require('./routes/utilisateurRoutes');

/** Création de l'application Express */
const app = express();

/** Middlewares */
app.use(cors());
app.use(express.json());

/** Routes */
app.use('/api/playlists', playlistRoutes);
app.use('/api/utilisateurs', utilisateurRoutes);

/** Route de test */
app.get('/', (req, res) => res.json({ status: 'API Online' }));

/** Exportation de l'application */
module.exports = app;