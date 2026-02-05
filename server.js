/**
 * server.js                05/02/2026
 * MIAGE de Toulouse, pas de copyright
 */

const http = require('http');
const app = require('./app');

/** Chargement des variables d'environnement */
require('dotenv').config();

/** Configuration du port */
const port = process.env.PORT || 3000;
app.set('port', port);

/** Création du serveur HTTP */
const server = http.createServer(app);

/** Démarrage du serveur */
server.listen(port, () => {
    console.log(`Serveur Backend démarré sur le port ${port}`);
});