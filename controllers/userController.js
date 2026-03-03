/**
 * userController.js
 */
const userService = require('../services/userService'); // On appelle le service, pas le contrôleur !
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// NOTE : J'ai supprimé la ligne "const userCtrl = require..." qui créait une boucle.

/**
 * Vérifie si le pseudo est valide (Etape 1)
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

/**
 * Vérifie si le mot de passe est valide (Etape 2)
 */
exports.login = async (req, res) => {
    try {
        const { pseudo, password } = req.body;

        // CORRECTION 1 : On appelle le SERVICE (pas userCtrl)
        const user = await userService.getLoginInfo(pseudo);

        if (!user) {
            return res.status(401).json({ error: 'Utilisateur inconnu' });
        }

        //const valid = (password === user.mot_de_passe_hash); // provisoire jusqu'à l'ajout du mdp chiffré dans la BD
        const valid = await bcrypt.compare(password, user.mot_de_passe_hash);

        if (!valid) {
            return res.status(401).json({ error: 'Mot de passe incorrect' });
        }
        const token = jwt.sign(
            { id: user.id },
            process.env.JWT_SECRET || 'SECRET_TEMPORAIRE',
            { expiresIn: '1h' }
        );

        res.status(200).json({
            userId: user.id,
            token: token
        });

    } catch (e) {
        console.error(e);
        res.status(500).json({ error: e.message });
    }
};
/**
 * Vérifie si l'utilisateur n'existe pas déjà
 */
exports.register = async (req, res) => {
    try {
        console.log(req.body);
        const { pseudo, password, email }  = req.body;
        if (!pseudo) {
            return res.status(400).json({ error: "Le paramètre 'pseudo' est requis." });
        }
        if (!password){
            return res.status(400).json({ error: "Le paramètre 'password' est requis" });
        }
        if (!email){
            return res.status(400).json({ error: "Le paramètre email est réquis" });
        }
        const userInfos = await userService.getUserInfos(pseudo);
        const hashMdp = await bcrypt.hash(password, 10);

        if(userInfos) {
            return res.status(409).json({ error: "Ce pseudo est déjà utilisé." });
        }
        const newUserId = await userService.createUser(pseudo, email, hashMdp);
        res.status(201).json({
            message: "Compte créé avec succès !",
            userId: newUserId
        });

    } catch (e) {
        console.error("Erreur lors de l'inscription :", e);
        res.status(500).json({ error: e.message });
    }
};