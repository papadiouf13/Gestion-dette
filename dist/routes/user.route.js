"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controller_1 = require("../controllers/user.controller");
const authenticateToken_1 = require("../middlewares/authenticateToken");
const routerUser = (0, express_1.Router)();
const userController = new user_controller_1.UserController();
/**
 * @openapi
 * /api/v1/users/register:
 *   post:
 *     tags:
 *       - Utilisateur
 *     summary: Enregistre un nouvel utilisateur
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserRequest'
 *     responses:
 *       '201':
 *         description: Utilisateur créé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserResponse'
 *       '400':
 *         description: Bad Request - Données invalides
 *       '409':
 *         description: Conflict - Utilisateur déjà existant
 *       '500':
 *         description: Internal Server Error - Erreur serveur
 */
routerUser.post('/register', userController.register);
/**
 * @openapi
 * /api/v1/users:
 *   get:
 *     tags:
 *       - Utilisateur
 *     summary: Lister les utilisateurs par rôle
 *     parameters:
 *       - in: query
 *         name: role
 *         required: true
 *         schema:
 *           type: string
 *           enum: [ADMIN, BOUTIQUIER, CLIENT]
 *           example: ADMIN
 *         description: Rôle des utilisateurs à récupérer
 *     responses:
 *       '200':
 *         description: Liste des utilisateurs récupérés
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       '400':
 *         description: Bad Request - Rôle invalide
 *       '500':
 *         description: Internal Server Error - Erreur serveur
 */
routerUser.get('/', [(0, authenticateToken_1.authentification)(), (0, authenticateToken_1.roleautorisation)(['ADMIN'])], userController.listUsersByRole);
exports.default = routerUser;
