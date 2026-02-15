/**
 * utilisateurService.js                12/02/2026
 * MIAGE de Toulouse, pas de copyright
 */

const db = require('../config/db');

/**
 * Récupérer tous les utilisateurs
 * @returns {Promise<Array>} Liste des utilisateurs
 */
exports.getAllUtilisateurs = async () => {
    const sql = `SELECT id, pseudo, email, date_inscription FROM utilisateur`;
    const [rows] = await db.query(sql);
    return rows;
};

