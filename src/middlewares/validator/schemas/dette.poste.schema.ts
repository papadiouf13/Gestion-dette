import { z } from "zod";

export const dettePostSchema = z.object({
    clientId: z.number({
        message: "L'identifiant du client est obligatoire.",
    }).min(1, "L'identifiant du client ne doit pas être vide"),
    articles: z.array(
        z.object({
            articleId: z.number({
                message: "L'identifiant de l'article est obligatoire.",
            }).min(1, "L'identifiant de l'article ne doit pas être vide"),
            quantiteArticleDette: z.number({
                message: "La quantité de l'article est obligatoire.",
            }).min(1, "La quantité de l'article ne doit pas être vide")
            .positive("La quantité doit être positive."),
        })
    ).nonempty("La liste des articles ne doit pas être vide.")
});
