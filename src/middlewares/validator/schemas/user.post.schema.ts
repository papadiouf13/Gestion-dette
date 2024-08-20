import { z } from "zod";
import app from "../../../app";

// Fonction pour vérifier l'unicité de l'adresse email
export const verifiEmail = async (value: string) => {
  const count = await app.prisma.user.count({
    where: { email: value },
  });
  return count < 1;
};

// Fonction pour vérifier l'existence d'un client avec un clientId donné
export const verifiClientId = async (clientId: number) => {
  const count = await app.prisma.client.count({
    where: { id: clientId },
  });
  return count > 0;
};

// Schéma de validation pour les utilisateurs
export const userPostSchema = z.object({
  email: z.string({
    required_error: "L'adresse email est obligatoire",
  })
  .email("L'adresse email n'est pas valide")  // Assure que l'email est valide
  .refine(async (value) => await verifiEmail(value), "L'adresse email existe déjà"),

  password: z.string({
    required_error: "Le mot de passe est obligatoire",
  })
  .min(6, "Le mot de passe doit contenir au moins 6 caractères"),  // Assure que le mot de passe est suffisamment long

  clientId: z.number({
    required_error: "Le clientId est obligatoire",
  })
  .int("Le clientId doit être un nombre entier")
  .refine(async (value) => await verifiClientId(value), "Le clientId spécifié n'existe pas"),

  role: z.enum(["ADMIN", "BOUTIQUIER"], {
    required_error: "Le rôle est obligatoire",
  })
});
