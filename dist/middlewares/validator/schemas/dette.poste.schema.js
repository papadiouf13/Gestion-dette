"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dettePostSchema = void 0;
const zod_1 = require("zod");
exports.dettePostSchema = zod_1.z.object({
    clientId: zod_1.z.number({
        message: "L'identifiant du client est obligatoire.",
    }).min(1, "L'identifiant du client ne doit pas être vide"),
    articles: zod_1.z.array(zod_1.z.object({
        articleId: zod_1.z.number({
            message: "L'identifiant de l'article est obligatoire.",
        }).min(1, "L'identifiant de l'article ne doit pas être vide"),
        quantiteArticleDette: zod_1.z.number({
            message: "La quantité de l'article est obligatoire.",
        }).min(1, "La quantité de l'article ne doit pas être vide")
            .positive("La quantité doit être positive."),
    })).nonempty("La liste des articles ne doit pas être vide.")
});
