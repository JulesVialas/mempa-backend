/**
 * userService.js                09/02/2026
 * MIAGE de Toulouse, pas de copyright
 */

const db = require('../config/db');

/**
 * Vérification de l'existance du compte associé au pseudo
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

/**
 * Récupérer toutes les informations de l'utilisateur
 * @param {Object} user_pseudo - Objet contenant le pseudo de l'utilisateur
 */
exports.getLoginInfo = async (user_pseudo) => {
    let sql = `
    SELECT u.id, u.pseudo, u.mot_de_passe_hash
    FROM utilisateur u
    WHERE pseudo = ? `;
    const [rows] = await db.query(sql, [user_pseudo]);
    return rows[0];
};

exports.createUser = async (pseudo, email, password) => {
    const sql = `
        INSERT INTO utilisateur (pseudo, email, mot_de_passe_hash)
        VALUES (?, ?, ?)
    `;
    const [result] = await db.query(sql, [pseudo, email, password]);
    return result.insertId;
};