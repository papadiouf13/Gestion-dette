"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const client_controller_1 = require("../controllers/client.controller");
const authenticateToken_1 = require("../middlewares/authenticateToken");
const routerClient = (0, express_1.Router)();
const clientController = new client_controller_1.ClientController();
/**
 * @openapi
 * /api/v1/clients/{id}:
 *   get:
 *     tags:
 *       - Clients
 *     summary: Récupère un client par ID
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID du client
 *         schema:
 *           type: integer
 *     responses:
 *       '200':
 *         description: Client trouvé
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Client'
 *       '404':
 *         description: Client non trouvé
 *       '401':
 *         description: Non autorisé
 *       '403':
 *         description: Interdit
 *       '500':
 *         description: Erreur serveur
 */
routerClient.get("/:id", [(0, authenticateToken_1.authentification)(), (0, authenticateToken_1.roleautorisation)(["BOUTIQUIER"])], clientController.edit);
/**
 * @openapi
 * /api/v1/clients/{id}/dettes:
 *   get:
 *     tags:
 *       - Clients
 *     summary: Récupère les dettes d'un client par ID
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID du client
 *         schema:
 *           type: integer
 *     responses:
 *       '200':
 *         description: Liste des dettes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Dette'
 *       '404':
 *         description: Client non trouvé
 *       '401':
 *         description: Non autorisé
 *       '403':
 *         description: Interdit
 *       '500':
 *         description: Erreur serveur
 */
routerClient.get("/:id/dettes", [(0, authenticateToken_1.authentification)(), (0, authenticateToken_1.roleautorisation)(["BOUTIQUIER"])], clientController.getDettesClient);
/**
 * @openapi
 * /api/v1/clients/{id}/user:
 *   get:
 *     tags:
 *       - Clients
 *     summary: Récupère l'utilisateur associé à un client par ID
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID du client
 *         schema:
 *           type: integer
 *     responses:
 *       '200':
 *         description: Utilisateur trouvé
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       '404':
 *         description: Client ou utilisateur non trouvé
 *       '401':
 *         description: Non autorisé
 *       '403':
 *         description: Interdit
 *       '500':
 *         description: Erreur serveur
 */
routerClient.get("/:id/user", [(0, authenticateToken_1.authentification)(), (0, authenticateToken_1.roleautorisation)(["BOUTIQUIER"])], clientController.getUserClient);
/**
 * @openapi
 * /api/v1/clients/telephone:
 *   post:
 *     tags:
 *       - Clients
 *     summary: Récupère un client par téléphone
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               telephone:
 *                 type: string
 *                 example: "+33612345678"
 *     responses:
 *       '200':
 *         description: Client trouvé
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Client'
 *       '404':
 *         description: Client non trouvé
 *       '401':
 *         description: Non autorisé
 *       '403':
 *         description: Interdit
 *       '500':
 *         description: Erreur serveur
 */
routerClient.post("/telephone", [(0, authenticateToken_1.authentification)(), (0, authenticateToken_1.roleautorisation)(["BOUTIQUIER"])], clientController.editByTelephone);
/**
 * @openapi
 * /api/v1/clients:
 *   get:
 *     tags:
 *       - Clients
 *     summary: Liste tous les clients
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       '200':
 *         description: Liste des clients
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Client'
 *       '401':
 *         description: Non autorisé
 *       '403':
 *         description: Interdit
 *       '500':
 *         description: Erreur serveur
 */
routerClient.get("/", [(0, authenticateToken_1.authentification)(), (0, authenticateToken_1.roleautorisation)(["BOUTIQUIER"])], clientController.show);
/**
 * @openapi
 * /api/v1/clients:
 *   post:
 *     tags:
 *       - Clients
 *     summary: Crée un nouveau client
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ClientRequest'
 *     responses:
 *       '201':
 *         description: Client créé
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Client'
 *       '400':
 *         description: Mauvaise requête
 *       '401':
 *         description: Non autorisé
 *       '403':
 *         description: Interdit
 *       '500':
 *         description: Erreur serveur
 */
routerClient.post("/", clientController.store);
/**
 * @openapi
 * /api/v1/clients/dettes/client:
 *   get:
 *     tags:
 *       - Clients
 *     summary: Récupère les dettes du client authentifié
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       '200':
 *         description: Liste des dettes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Dette'
 *       '401':
 *         description: Non autorisé
 *       '403':
 *         description: Interdit
 *       '500':
 *         description: Erreur serveur
 */
routerClient.get("/dettes/client", [(0, authenticateToken_1.authentification)(), (0, authenticateToken_1.roleautorisation)(["CLIENT"])], clientController.getDetteClient);
/**
 * @openapi
 * /api/v1/clients/dette/{id}/article:
 *   get:
 *     tags:
 *       - Clients
 *     summary: Récupère les articles d'une dette pour le client authentifié
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la dette
 *         schema:
 *           type: integer
 *     responses:
 *       '200':
 *         description: Liste des articles
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Article'
 *       '404':
 *         description: Dette non trouvée
 *       '401':
 *         description: Non autorisé
 *       '403':
 *         description: Interdit
 *       '500':
 *         description: Erreur serveur
 */
routerClient.get("/dette/:id/article", [(0, authenticateToken_1.authentification)(), (0, authenticateToken_1.roleautorisation)(["CLIENT"])], clientController.getDetteArticleClient);
/**
 * @openapi
 * /api/v1/clients/dette/{id}/paiement:
 *   get:
 *     tags:
 *       - Clients
 *     summary: Récupère les paiements d'une dette pour le client authentifié
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la dette
 *         schema:
 *           type: integer
 *     responses:
 *       '200':
 *         description: Liste des paiements
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Paiement'
 *       '404':
 *         description: Dette non trouvée
 *       '401':
 *         description: Non autorisé
 *       '403':
 *         description: Interdit
 *       '500':
 *         description: Erreur serveur
 */
routerClient.get("/dette/:id/paiement", [(0, authenticateToken_1.authentification)(), (0, authenticateToken_1.roleautorisation)(["CLIENT"])], clientController.getPaiementDetteClient);
exports.default = routerClient;
