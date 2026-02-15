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

/**
 * Récupérer une playlist par son ID
 */
exports.getById = async (req, res) => {
    try {
        const playlist = await playlistService.getPlaylistById(req.params.id);
        if (!playlist) {
            return res.status(404).json({ error: 'Playlist non trouvée' });
        }
        res.json(playlist);
    } catch (e) { res.status(500).json({ error: e.message }); }
};

/**
 * Récupérer les morceaux d'une playlist
 */
exports.getContenu = async (req, res) => {
    try {
        const morceaux = await playlistService.getContenuPlaylist(req.params.id);
        res.json(morceaux);
    } catch (e) { res.status(500).json({ error: e.message }); }
};
