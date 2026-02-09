/**
 * playlistController.js                05/02/2026
 * MIAGE de Toulouse, pas de copyright
 */

const playlistService = require('../services/playlistService');

/**
 * Récupérer toutes les playlists (avec filtres optionnels)
 */
exports.getAll = async (req, res) => {
    try {
        const playlists = await playlistService.getAllPlaylists(req.query);
        res.json(playlists);
    } catch (e) { res.status(500).json({ error: e.message }); }
};