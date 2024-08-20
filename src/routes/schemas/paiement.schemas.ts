/**
 * @openapi
 * components:
 *   schemas:
 *     Paiement:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         montant:
 *           type: number
 *           format: float
 *           example: 100.50
 *         date:
 *           type: string
 *           format: date
 *           example: 2024-08-01
 *         detteId:
 *           type: integer
 *           example: 1
 *       required:
 *         - id
 *         - montant
 *         - date
 *         - detteId
 * 
 *     PaiementRequest:
 *       type: object
 *       properties:
 *         montant:
 *           type: number
 *           format: float
 *           example: 100.50
 *         date:
 *           type: string
 *           format: date
 *           example: 2024-08-01
 *       required:
 *         - montant
 *         - date
 * 
 *     PaiementResponse:
 *       type: object
 *       properties:
 *         paiement:
 *           $ref: '#/components/schemas/Paiement'
 *         updatedDette:
 *           $ref: '#/components/schemas/Dette'
 *       required:
 *         - paiement
 *         - updatedDette
 * 
 *     PaiementListResponse:
 *       type: object
 *       properties:
 *         paiements:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Paiement'
 *       required:
 *         - paiements
 */
