/**
 * utilisateurController.js                12/02/2026
 * MIAGE de Toulouse, pas de copyright
 */

const utilisateurService = require('../services/utilisateurService');

/**
 * Récupérer tous les utilisateurs
 */
exports.getAll = async (req, res) => {
    try {
        const utilisateurs = await utilisateurService.getAllUtilisateurs();
        res.json(utilisateurs);
    } catch (e) { res.status(500).json({ error: e.message }); }
};
