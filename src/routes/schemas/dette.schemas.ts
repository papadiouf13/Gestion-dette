/**
 * @openapi
 * components:
 *   schemas:
 *     Dette:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         clientId:
 *           type: integer
 *           example: 123
 *         date:
 *           type: string
 *           format: date-time
 *           example: 2024-08-20T14:48:00.000Z
 *         montantVerser:
 *           type: number
 *           format: float
 *           example: 150.75
 *         statut:
 *           type: string
 *           enum: [solde, non_solde]
 *           example: non_solde
 *         articles:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               articleId:
 *                 type: integer
 *                 example: 1
 *               quantiteArticleDette:
 *                 type: integer
 *                 example: 5
 *       required:
 *         - id
 *         - clientId
 *         - date
 *         - statut
 *         - articles
 * 
 *     DetteRequest:
 *       type: object
 *       properties:
 *         clientId:
 *           type: integer
 *           example: 123
 *         montantVerser:
 *           type: number
 *           format: float
 *           example: 150.75
 *         articles:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               articleId:
 *                 type: integer
 *                 example: 1
 *               quantiteArticleDette:
 *                 type: integer
 *                 example: 5
 *       required:
 *         - clientId
 *         - articles
 */
