/**
 * @openapi
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         email:
 *           type: string
 *           example: user@example.com
 *         role:
 *           type: string
 *           enum: [ADMIN, BOUTIQUIER, CLIENT]
 *           example: ADMIN
 *         clientId:
 *           type: integer
 *           example: 1
 *       required:
 *         - id
 *         - email
 *         - role
 *         - clientId
 * 
 *     UserRequest:
 *       type: object
 *       properties:
 *         email:
 *           type: string
 *           example: user@example.com
 *         password:
 *           type: string
 *           format: password
 *           example: password123
 *         clientId:
 *           type: integer
 *           example: 1
 *         role:
 *           type: string
 *           enum: [ADMIN, BOUTIQUIER, CLIENT]
 *           example: ADMIN
 *       required:
 *         - email
 *         - password
 *         - clientId
 *         - role
 * 
 *     UserResponse:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         email:
 *           type: string
 *           example: user@example.com
 *         role:
 *           type: string
 *           enum: [ADMIN, BOUTIQUIER, CLIENT]
 *           example: ADMIN
 *         clientId:
 *           type: integer
 *           example: 1
 *       required:
 *         - id
 *         - email
 *         - role
 *         - clientId
 * 
 *     RoleEnum:
 *       type: string
 *       enum:
 *         - ADMIN
 *         - BOUTIQUIER
 *         - CLIENT
 *       example: ADMIN
 */
