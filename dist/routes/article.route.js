"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const article_controller_1 = require("../controllers/article.controller");
const validator_middleware_1 = require("../middlewares/validator/validator.middleware");
const authenticateToken_1 = require("../middlewares/authenticateToken");
const routerArticle = (0, express_1.Router)();
const articleController = new article_controller_1.ArticleController();
/**
 * @openapi
 * /api/v1/articles:
 *   get:
 *     tags:
 *       - Articles
 *     summary: Liste tous les articles
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       '200':
 *         description: Liste des articles
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Article'
 *       '401':
 *         description: Non autorisé
 *       '403':
 *         description: Interdit
 *       '500':
 *         description: Erreur serveur
 */
routerArticle.get("/", [(0, authenticateToken_1.authentification)(), (0, authenticateToken_1.roleautorisation)(["BOUTIQUIER"])], articleController.show);
/**
 * @openapi
 * /api/v1/articles/{id}:
 *   get:
 *     tags:
 *       - Articles
 *     summary: Récupère un article par ID
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de l'article
 *         schema:
 *           type: integer
 *     responses:
 *       '200':
 *         description: Article trouvé
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Article'
 *       '404':
 *         description: Article non trouvé
 *       '401':
 *         description: Non autorisé
 *       '403':
 *         description: Interdit
 *       '500':
 *         description: Erreur serveur
 */
routerArticle.get("/:id", [(0, authenticateToken_1.authentification)(), (0, authenticateToken_1.roleautorisation)(["BOUTIQUIER"])], articleController.edit);
/**
 * @openapi
 * /api/v1/articles/{id}/stock:
 *   put:
 *     tags:
 *       - Articles
 *     summary: Met à jour la quantité en stock d'un article
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de l'article
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               quantiteStock:
 *                 type: integer
 *                 example: 50
 *     responses:
 *       '200':
 *         description: Quantité en stock mise à jour
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Article'
 *       '404':
 *         description: Article non trouvé
 *       '400':
 *         description: Mauvaise requête
 *       '401':
 *         description: Non autorisé
 *       '403':
 *         description: Interdit
 *       '500':
 *         description: Erreur serveur
 */
routerArticle.put("/:id/stock", [(0, authenticateToken_1.authentification)(), (0, authenticateToken_1.roleautorisation)(["BOUTIQUIER"])], articleController.editByStock);
/**
 * @openapi
 * /api/v1/articles:
 *   post:
 *     tags:
 *       - Articles
 *     summary: Crée un nouvel article
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ArticleRequest'
 *     responses:
 *       '201':
 *         description: Article créé
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Article'
 *       '400':
 *         description: Mauvaise requête
 *       '401':
 *         description: Non autorisé
 *       '403':
 *         description: Interdit
 *       '500':
 *         description: Erreur serveur
 */
routerArticle.post("/", [(0, authenticateToken_1.authentification)(), (0, authenticateToken_1.roleautorisation)(["BOUTIQUIER"]), (0, validator_middleware_1.validatorSchema)()], articleController.store);
exports.default = routerArticle;
