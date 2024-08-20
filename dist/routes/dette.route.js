"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const dette_controller_1 = require("../controllers/dette.controller");
const validator_middleware_1 = require("../middlewares/validator/validator.middleware");
const authenticateToken_1 = require("../middlewares/authenticateToken");
const routerDette = (0, express_1.Router)();
const detteController = new dette_controller_1.DetteController();
/**
 * @openapi
 * /api/v1/dettes/filter:
 *   get:
 *     tags:
 *       - Dette
 *     summary: Filtre les dettes par statut
 *     parameters:
 *       - in: query
 *         name: statut
 *         schema:
 *           type: string
 *           enum: [solde, non_solde]
 *           example: non_solde
 *         required: true
 *         description: Statut de la dette
 *     responses:
 *       '200':
 *         description: Liste des dettes filtrées
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Dette'
 *       '404':
 *         description: Aucune dette trouvée
 *       '500':
 *         description: Internal Server Error - Erreur serveur
 */
routerDette.get("/filter", [(0, authenticateToken_1.authentification)(), (0, authenticateToken_1.roleautorisation)(["BOUTIQUIER"])], detteController.filterDettesByStatut);
/**
 * @openapi
 * /api/v1/dettes:
 *   get:
 *     tags:
 *       - Dette
 *     summary: Récupère toutes les dettes
 *     responses:
 *       '200':
 *         description: Liste de toutes les dettes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Dette'
 *       '500':
 *         description: Internal Server Error - Erreur serveur
 */
routerDette.get("/", [(0, authenticateToken_1.authentification)(), (0, authenticateToken_1.roleautorisation)(["BOUTIQUIER"])], detteController.show);
/**
 * @openapi
 * /api/v1/dettes/{id}:
 *   get:
 *     tags:
 *       - Dette
 *     summary: Récupère une dette par ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *         description: ID de la dette
 *     responses:
 *       '200':
 *         description: Dette trouvée
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Dette'
 *       '404':
 *         description: Dette non trouvée
 *       '500':
 *         description: Internal Server Error - Erreur serveur
 */
routerDette.get("/:id", [(0, authenticateToken_1.authentification)(), (0, authenticateToken_1.roleautorisation)(["BOUTIQUIER"])], detteController.edit);
/**
 * @openapi
 * /api/v1/dettes:
 *   post:
 *     tags:
 *       - Dette
 *     summary: Crée une nouvelle dette
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/DetteRequest'
 *     responses:
 *       '201':
 *         description: Dette créée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Dette'
 *       '400':
 *         description: Bad Request - Données invalides
 *       '500':
 *         description: Internal Server Error - Erreur serveur
 */
routerDette.post("/", [(0, authenticateToken_1.authentification)(), (0, authenticateToken_1.roleautorisation)(["BOUTIQUIER"]), (0, validator_middleware_1.validatorSchema)()], detteController.store);
/**
 * @openapi
 * /api/v1/dettes/date:
 *   post:
 *     tags:
 *       - Dette
 *     summary: Filtre les dettes par période
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/DateRequest'
 *     responses:
 *       '200':
 *         description: Liste des dettes filtrées par date
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Dette'
 *       '400':
 *         description: Bad Request - Données invalides
 *       '500':
 *         description: Internal Server Error - Erreur serveur
 */
routerDette.post("/date", [(0, authenticateToken_1.authentification)(), (0, authenticateToken_1.roleautorisation)(["BOUTIQUIER"])], [(0, validator_middleware_1.validatorSchema)()], detteController.editByDate);
exports.default = routerDette;
