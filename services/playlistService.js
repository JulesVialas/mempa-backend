/**
 * playlistService.js                05/02/2026
 * MIAGE de Toulouse, pas de copyright
 */

const db = require('../config/db');

/**
 * Récupérer toutes les playlists avec filtres et tris optionnels
 * @param {Object} filterObj - Objet contenant les paramètres de recherche, tri et ordre
 */
exports.getAllPlaylists = async (filterObj) => {
    let sql = `
        SELECT p.*, u.pseudo as nom_createur 
        FROM playlist p 
        JOIN utilisateur u ON p.createur_id = u.id
    `;
    const params = [];

    // Recherche FullText (V2)
    if (filterObj.search) {
        sql += ` WHERE MATCH(p.nom, p.style) AGAINST(? IN NATURAL LANGUAGE MODE)`;
        params.push(filterObj.search);
    }

    // Tris (V2)
    const validSorts = { 'alphabetic': 'nom', 'clics': 'nbre_clics', 'style': 'style' };
    const sortCol = validSorts[filterObj.sort] || 'date_creation';
    const sortDir = (filterObj.order === 'ASC') ? 'ASC' : 'DESC';

    sql += ` ORDER BY p.${sortCol} ${sortDir}`;

    const [rows] = await db.query(sql, params);
    return rows;
};

/**
 * Récupérer une playlist par son ID
 * @param {number} id - L'identifiant de la playlist
 */
exports.getPlaylistById = async (id) => {
    const sql = `
        SELECT p.*, u.pseudo as nom_createur 
        FROM playlist p 
        JOIN utilisateur u ON p.createur_id = u.id
        WHERE p.id = ?
    `;
    const [rows] = await db.query(sql, [id]);
    return rows[0] || null;
};

/**
 * Récupérer les morceaux d'une playlist
 * @param {number} playlistId - L'identifiant de la playlist
 */
exports.getContenuPlaylist = async (playlistId) => {
    const sql = `
        SELECT m.* 
        FROM morceau m
        JOIN contenu_playlist cp ON m.id = cp.morceau_id
        WHERE cp.playlist_id = ?
        ORDER BY cp.ordre ASC
    `;
    const [rows] = await db.query(sql, [playlistId]);
    return rows;
};

