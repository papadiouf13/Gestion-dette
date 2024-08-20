// types/express.d.ts
import { User } from "@prisma/client"; // Assurez-vous que le chemin est correct pour importer le modèle User

declare global {
    namespace Express {
        interface Request {
            user?: User; // ou le type approprié pour votre utilisateur
        }
    }
}
