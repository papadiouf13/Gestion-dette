"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.swaggerSpec = void 0;
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
// Configuration de Swagger
const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Gestion-Dette Swagger",
            version: "Version 1",
            description: "Documentation de l'API pour la gestion de dette.",
            license: {
                name: "Mamadou Diouf",
            },
            contact: {
                name: "Mamadou Diouf",
                email: "mamadou173diouf@gmail.com",
            },
        },
        componnents: {
            securitySchemes: {
                BearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT",
                },
            },
        },
        security: [
            {
                BearerAuth: [],
            },
        ],
    },
    apis: ["src/routes/**.ts", ".src/routes/schemas/*.ts"],
};
exports.swaggerSpec = (0, swagger_jsdoc_1.default)(options);
