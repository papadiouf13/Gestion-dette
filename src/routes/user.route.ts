import { Router } from 'express';
import { UserController } from '../controllers/user.controller';
import { validatorSchema} from "../middlewares/validator/validator.middleware";
import { authentification,roleautorisation } from "../middlewares/authenticateToken";

const routerUser = Router();
const userController = new UserController();

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
routerUser.post('/register',[authentification(), roleautorisation(['ADMIN']), validatorSchema()],userController.register);

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
routerUser.get('/',[authentification(), roleautorisation(['ADMIN'])],userController.listUsersByRole);

export default routerUser;
