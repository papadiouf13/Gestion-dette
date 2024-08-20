import { z } from "zod";
import app from "../../../app";

// Validation pour vérifier si une dette existe
export const verifiDetteId = async (value: number) => {
    const count = await app.prisma.dette.count({
        where: { id: value },
    });
    return count > 0;
}

// Schéma de validation pour la création de paiement
export const paiementPostSchema = z.object({
    montant: z.number({
        required_error: "Le montant est obligatoire",
    }).positive("Le montant doit être positif"),

    detteId: z.number({
        required_error: "L'ID de la dette est obligatoire",
    }).int("L'ID de la dette doit être un entier").refine(verifiDetteId, "La dette associée n'existe pas")
});
