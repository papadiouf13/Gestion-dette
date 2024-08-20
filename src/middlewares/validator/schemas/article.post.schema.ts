import { z } from "zod" ;
import app from "../../../app";

export const verifiLibelle = async(value: string) => {
    const count = await app.prisma.article.count({
        where: { libelle: value },
    });
    return count < 1;
}
  ;
export const articlePostSchema = z.object({
    libelle: z.string({
        required_error : "le libelle est obligatoire",
    }).min(1, "Le libelle ne doit pas être vide")
    .refine(verifiLibelle,"le lielle existe deja"),
    prix: z.number().positive({
        message : "le prix doit etre positive",
    }).min(1, "Le prix ne doit pas être vide"),
    quantiteStock: z.number().positive({
        message : "la quantite doit etre positive",

    }).min(1, "Le quantiteStock ne doit pas être vide"),
 
})