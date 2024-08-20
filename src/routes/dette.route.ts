import {Router} from "express"
import { DetteController } from "../controllers/dette.controller";
import { validatorSchema} from "../middlewares/validator/validator.middleware";
import { authentification, roleautorisation } from "../middlewares/authenticateToken";


const routerDette = Router();
const detteController = new DetteController();

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
routerDette.get("/filter", [authentification(), roleautorisation(["BOUTIQUIER"])], detteController.filterDettesByStatut);

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
routerDette.get("/",[authentification(),roleautorisation(["BOUTIQUIER"])], detteController.show)

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
routerDette.get("/:id",[authentification(),roleautorisation(["BOUTIQUIER"])], detteController.edit)

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
routerDette.post("/",[authentification(),roleautorisation(["BOUTIQUIER"]),validatorSchema()], detteController.store)


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
routerDette.post("/date",[authentification(),roleautorisation(["BOUTIQUIER"])],[validatorSchema()], detteController.editByDate)

export default routerDette;