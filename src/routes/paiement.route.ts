import { Router } from "express";
import { PaiementController } from "../controllers/paiement.controller";
import { validatorSchema } from "../middlewares/validator/validator.middleware";
import { authentification,roleautorisation } from "../middlewares/authenticateToken";


const routerPaiement = Router();
const paiementController = new PaiementController();

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
routerPaiement.post("/:id/paiements",[authentification(),roleautorisation(["BOUTIQUIER"])], [validatorSchema()], paiementController.store);

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
routerPaiement.get("/:id/paiements",[authentification(),roleautorisation(["BOUTIQUIER"])], paiementController.getPaiementsForDette);

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
routerPaiement.get("/paiements",[authentification(),roleautorisation(["BOUTIQUIER"])], paiementController.show);

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
routerPaiement.get("/:id/articles",[authentification(),roleautorisation(["BOUTIQUIER"])], paiementController.getArticlesForDette);


export default routerPaiement;
