/**
 * db.js                05/02/2026
 * MIAGE de Toulouse, pas de copyright
 */

const mysql = require('mysql2');

/** Chargement des variables d'environnement */
require('dotenv').config();

/**
 * Configuration de la connexion à la base de données MySQL
 */
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

/**
 * Test de connexion
 */
pool.getConnection((err, connection) => {
    if (err) {
        console.error('Erreur BDD (' + process.env.DB_HOST + ') :', err.message);
    } else {
        console.log('Connecté à MySQL sur ' + process.env.DB_HOST);
        connection.release();
    }
});

/**
 * Exportation de l'objet pool pour les requêtes
 */
module.exports = pool.promise();