"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const paiement_controller_1 = require("../controllers/paiement.controller");
const validator_middleware_1 = require("../middlewares/validator/validator.middleware");
const authenticateToken_1 = require("../middlewares/authenticateToken");
const routerPaiement = (0, express_1.Router)();
const paiementController = new paiement_controller_1.PaiementController();
/**
 * @openapi
 * /api/v1/dettes/{id}/paiements:
 *   post:
 *     tags:
 *       - Paiement
 *     summary: Ajouter un paiement pour une dette spécifique
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *         description: ID de la dette
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PaiementRequest'
 *     responses:
 *       '201':
 *         description: Paiement ajouté avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaiementResponse'
 *       '400':
 *         description: Bad Request - Données invalides
 *       '404':
 *         description: Dette non trouvée
 *       '500':
 *         description: Internal Server Error - Erreur serveur
 */
routerPaiement.post("/:id/paiements", [(0, authenticateToken_1.authentification)(), (0, authenticateToken_1.roleautorisation)(["BOUTIQUIER"])], [(0, validator_middleware_1.validatorSchema)()], paiementController.store);
/**
 * @openapi
 * /api/v1/dettes/{id}/paiements:
 *   get:
 *     tags:
 *       - Paiement
 *     summary: Afficher tous les paiements pour une dette spécifique
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
 *         description: Liste des paiements pour la dette spécifiée
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaiementListResponse'
 *       '400':
 *         description: Bad Request - ID de dette invalide
 *       '404':
 *         description: Dette non trouvée
 *       '500':
 *         description: Internal Server Error - Erreur serveur
 */
routerPaiement.get("/:id/paiements", [(0, authenticateToken_1.authentification)(), (0, authenticateToken_1.roleautorisation)(["BOUTIQUIER"])], paiementController.getPaiementsForDette);
/**
 * @openapi
 * /api/v1/paiements:
 *   get:
 *     tags:
 *       - Paiement
 *     summary: Afficher tous les paiements
 *     responses:
 *       '200':
 *         description: Liste de tous les paiements
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaiementListResponse'
 *       '500':
 *         description: Internal Server Error - Erreur serveur
 */
routerPaiement.get("/paiements", [(0, authenticateToken_1.authentification)(), (0, authenticateToken_1.roleautorisation)(["BOUTIQUIER"])], paiementController.show);
/**
 * @openapi
 * /api/v1/dettes/{id}/articles:
 *   get:
 *     tags:
 *       - Paiement
 *     summary: Afficher tous les articles d'une dette spécifique
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
 *         description: Liste des articles associés à la dette
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Article'
 *       '400':
 *         description: Bad Request - ID de dette invalide
 *       '404':
 *         description: Dette non trouvée
 *       '500':
 *         description: Internal Server Error - Erreur serveur
 */
routerPaiement.get("/:id/articles", [(0, authenticateToken_1.authentification)(), (0, authenticateToken_1.roleautorisation)(["BOUTIQUIER"])], paiementController.getArticlesForDette);
exports.default = routerPaiement;
