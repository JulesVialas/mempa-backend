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
 * Vérifie si une playlist existe déjà pour un créateur donné
 */
exports.findByNomAndCreateur = async (nom, createur_id) => {
    const sql = `
        SELECT * 
        FROM playlist 
        WHERE nom = ? 
          AND createur_id = ?
    `;
    const [rows] = await db.query(sql, [nom, createur_id]);
    return rows[0];
};

/**
 * Crée une nouvelle playlist dans la base de données
 */
exports.createPlaylist = async (playlistData) => {
    const { nom, style } = playlistData;
    const createur_id = 1; // TODO: Récupérer l'ID du créateur à partir de l'authentification
    const nbre_clics = 0;

    const sql = `
        INSERT INTO playlist (nom, style, nbre_clics, createur_id, date_modification) 
        VALUES (?, ?, ?, ?, NOW())
    `;

    const [result] = await db.query(sql, [nom, style, nbre_clics, createur_id]);
    return { id: result.insertId, nom, style };
};