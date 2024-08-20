/**
 * @openapi
 * components:
 *   schemas:
 *     Client:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         nom:
 *           type: string
 *           example: Dupont
 *         prenom:
 *           type: string
 *           example: Jean
 *         telephone:
 *           type: string
 *           example: "+33612345678"
 *         photo:
 *           type: string
 *           example: "http://example.com/photo.jpg"
 *         user:
 *           $ref: '#/components/schemas/User'
 *       required:
 *         - id
 *         - nom
 *         - prenom
 *         - telephone
 * 
 *     ClientRequest:
 *       type: object
 *       properties:
 *         nom:
 *           type: string
 *           example: Dupont
 *         prenom:
 *           type: string
 *           example: Jean
 *         telephone:
 *           type: string
 *           example: "+33612345678"
 *         photo:
 *           type: string
 *           example: "http://example.com/photo.jpg"
 *         email:
 *           type: string
 *           example: "jean.dupont@example.com"
 *         password:
 *           type: string
 *           example: "securepassword123"
 *       required:
 *         - nom
 *         - prenom
 *         - telephone
 *         - email
 *         - password
 */
