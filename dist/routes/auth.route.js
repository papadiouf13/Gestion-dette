"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("../controllers/auth.controller");
const authenticateToken_1 = require("../middlewares/authenticateToken");
const routerAuth = (0, express_1.Router)();
const authController = new auth_controller_1.AuthController();
/**
 * @openapi
 * /api/v1/auth/register:
 *   post:
 *     tags:
 *       - Authentification
 *     summary: Enregistre un nouvel utilisateur
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterUserInput'
 *     responses:
 *       '201':
 *         description: Utilisateur créé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RegisterUserResponse'
 *       '400':
 *         description: Bad Request - Le rôle spécifié n'est pas valide ou clientId non trouvé
 *       '409':
 *         description: Conflict - Utilisateur déjà existant
 */
routerAuth.post('/register', [(0, authenticateToken_1.authentification)(), (0, authenticateToken_1.roleautorisation)(["ADMIN"])], authController.register);
/**
 * @openapi
 * /api/v1/auth/login:
 *   post:
 *     tags:
 *       - Authentification
 *     summary: Connecte un utilisateur existant
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       '200':
 *         description: Connexion réussie
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TokenResponse'
 *       '400':
 *         description: Bad Request - Email ou mot de passe incorrect
 *       '401':
 *         description: Unauthorized - Email ou mot de passe incorrect
 */
routerAuth.post('/login', authController.login);
exports.default = routerAuth;
