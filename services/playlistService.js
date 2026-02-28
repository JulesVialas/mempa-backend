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
exports.createPlaylist = async (playlistData, createur_id) => {
    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();

        // Création de la playlist
        const [pResult] = await connection.query(
            'INSERT INTO playlist (nom, style, createur_id, nbre_clics, date_creation, date_modification) VALUES (?, ?, ?, 0, NOW(), NOW())',
            [playlistData.nom, playlistData.style, createur_id]
        );
        const playlistId = pResult.insertId;

        // Ajout des morceaux
        if (playlistData.morceaux) {
            for (const track of playlistData.morceaux) {
                const morceauId = await exports.getOrCreateMorceau(connection, track);
                await exports.lierMorceauPlaylist(connection, playlistId, morceauId);
            }
        }

        await connection.commit();
        return playlistId;
    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
    }
};


/**
 * Ajoute un morceau à une playlist en lui assignant la position suivante disponible
 * @param connection
 * @param playlistId
 * @param morceauId
 * @returns {Promise<void>}
 */
exports.lierMorceauPlaylist = async (connection, playlistId, morceauId) => {
    const sql = `
        INSERT INTO contenu_playlist (playlist_id, morceau_id, position, date_ajout)
        VALUES (?, ?,
                (SELECT next_pos FROM (
                                          SELECT COALESCE(MAX(position), 0) + 1 AS next_pos
                                          FROM contenu_playlist
                                          WHERE playlist_id = ?
                                      ) AS temp),
                NOW()
               )
    `;
    await connection.query(sql, [playlistId, morceauId, playlistId]);
}

/**
 * Récupère l'ID d'un morceau existant ou en crée un nouveau s'il n'existe pas
 * @param connection - Connexion à la base de données
 * @param data - Objet contenant les données du morceau (titre et artiste)
 * @returns {Promise<number>} - ID du morceau existant ou nouvellement créé
 */
exports.getOrCreateMorceau = async (connection, data) => {
    const [exist] = await connection.query(
        'SELECT id FROM morceau WHERE titre = ? AND artiste = ?',
        [data.titre, data.artiste]
    );
    if (exist.length > 0) return exist[0].id;

    const [res] = await connection.query(
        'INSERT INTO morceau (titre, artiste) VALUES (?, ?)',
        [data.titre, data.artiste]
    );
    return res.insertId;
}