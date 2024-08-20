import { Router } from "express";
import { ArticleController } from "../controllers/article.controller";
import { validatorSchema } from "../middlewares/validator/validator.middleware";
import { authentification, roleautorisation } from "../middlewares/authenticateToken";

const routerArticle = Router();
const articleController = new ArticleController();

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
routerArticle.get("/", [authentification(), roleautorisation(["BOUTIQUIER"])], articleController.show);

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
routerArticle.get("/:id", [authentification(), roleautorisation(["BOUTIQUIER"])], articleController.edit);

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
routerArticle.put("/:id/stock", [authentification(), roleautorisation(["BOUTIQUIER"])], articleController.editByStock);

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
routerArticle.post("/", [authentification(), roleautorisation(["BOUTIQUIER"]), validatorSchema()], articleController.store);

export default routerArticle;
