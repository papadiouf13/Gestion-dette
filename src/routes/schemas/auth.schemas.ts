/**
 * @openapi
 * components:
 *   schemas:
 *     RegisterRequest:
 *       type: object
 *       required:
 *         - email
 *         - password
 *         - clientId
 *       properties:
 *         email:
 *           type: string
 *           example: user@example.com
 *         password:
 *           type: string
 *           example: password123
 *         clientId:
 *           type: Number
 *           default: 0
 *      UserResponse:
 *          type: object
 *          properties:
 *          status:
 *          type: string
 *          data:
 *           
 * 
 * 
 *     LoginRequest:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           example: user@example.com
 *         password:
 *           type: string
 *           example: password123
 * 
 *     UserResponse:
 *       type: object
 *       properties:
 *         token:
 *           type: string
 */
