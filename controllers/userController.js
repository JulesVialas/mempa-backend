/**
 * userController.js                09/02/2026
 * MIAGE de Toulouse, pas de copyright
 */

const userService = require('../services/userService');

/**
 * Récupérer toutes les informations de l'utilisateur avec son pseudo
 */
exports.getByPseudo = async (req, res) => {
    try {
        const pseudo = req.query.pseudo;
        if (!pseudo) {
            return res.status(400).json({ error: "Le paramètre 'pseudo' est requis." });
        }
        const userInfos = await userService.getUserInfos(pseudo);
        res.json(userInfos);
    } catch (e) { res.status(500).json({ error: e.message }); }
};