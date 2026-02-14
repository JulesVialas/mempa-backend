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
 * Créer une nouvelle playlist
 * @param req
 * @param res
 */
exports.createPlaylist = async (req, res) => {
    try {
        // TODO createur_id doit venir de l'authentification
        const { nom } = req.body;
        const createur_id = 1
        const existingPlaylist = await playlistService.findByNomAndCreateur(nom, createur_id);
        if (existingPlaylist) {
            return res.status(409).json({
                error: `Une playlist avec le nom "${nom}" existe déjà pour ce créateur.`
            });
        }
        const newPlaylist = await playlistService.createPlaylist(req.body);
        res.status(201).json(newPlaylist);
    } catch (error) {
        res.status(500).json({ error: e.message });
    }
};