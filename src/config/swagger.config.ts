import swaggerJSDoc from "swagger-jsdoc";


// Configuration de Swagger
const options: swaggerJSDoc.Options = {
    definition:{
        openapi: "3.0.0",
        info: {
          title: "Gestion-Dette Swagger",
          version: "Version 1",
          description:
            "Documentation de l'API pour la gestion de dette.",
            license:{
                name: "Mamadou Diouf",
            },
            contact: {
                name: "Mamadou Diouf",
                email: "mamadou173diouf@gmail.com",
                telephone: "+221 707871049"
              },
        },
        components: {
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
apis: ["src/routes/**.ts",".src/routes/schemas/*.ts"],
};
export const swaggerSpec = swaggerJSDoc(options);