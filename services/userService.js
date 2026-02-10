/**
 * userService.js                09/02/2026
 * MIAGE de Toulouse, pas de copyright
 */

const db = require('../config/db');

/**
 * Récupérer toutes les playlists avec filtres et tris optionnels
 * @param {Object} user_pseudo - Objet contenant le pseudo de l'utilisateur
 */
exports.getUserInfos = async (user_pseudo) => {
    let sql = `
        SELECT u.id 
        FROM utilisateur u
        WHERE pseudo = ? `;
    const [rows] = await db.query(sql, [user_pseudo]);
    return rows[0];
};