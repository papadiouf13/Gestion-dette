import {Router} from "express"
import { ClientController } from "../controllers/client.controller";
import { validatorSchema} from "../middlewares/validator/validator.middleware";
import { authentification,roleautorisation } from "../middlewares/authenticateToken";

const routerClient= Router();
const clientController = new ClientController();

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
routerClient.get("/:id",[authentification(),roleautorisation(["BOUTIQUIER"])],clientController.edit);

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
routerClient.get("/:id/dettes", [authentification(),roleautorisation(["BOUTIQUIER"])],clientController.getDettesClient);

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
routerClient.get("/:id/user", [authentification(),roleautorisation(["BOUTIQUIER"])],clientController.getUserClient);

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
routerClient.post("/telephone", [authentification(),roleautorisation(["BOUTIQUIER"])],clientController.editByTelephone);

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
routerClient.get("/", [authentification(),roleautorisation(["BOUTIQUIER"])],clientController.show);

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
routerClient.get("/dettes/client", [authentification(),roleautorisation(["CLIENT"])],clientController.getDetteClient);

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
routerClient.get("/dette/:id/article", [authentification(),roleautorisation(["CLIENT"])],clientController.getDetteArticleClient);

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
routerClient.get("/dette/:id/paiement", [authentification(),roleautorisation(["CLIENT"])],clientController.getPaiementDetteClient);

export default routerClient;