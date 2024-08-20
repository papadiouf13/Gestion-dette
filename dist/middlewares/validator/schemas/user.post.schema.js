"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userPostSchema = exports.verifiClientId = exports.verifiEmail = void 0;
const zod_1 = require("zod");
const app_1 = __importDefault(require("../../../app"));
// Fonction pour vérifier l'unicité de l'adresse email
const verifiEmail = (value) => __awaiter(void 0, void 0, void 0, function* () {
    const count = yield app_1.default.prisma.user.count({
        where: { email: value },
    });
    return count < 1;
});
exports.verifiEmail = verifiEmail;
// Fonction pour vérifier l'existence d'un client avec un clientId donné
const verifiClientId = (clientId) => __awaiter(void 0, void 0, void 0, function* () {
    const count = yield app_1.default.prisma.client.count({
        where: { id: clientId },
    });
    return count > 0;
});
exports.verifiClientId = verifiClientId;
// Schéma de validation pour les utilisateurs
exports.userPostSchema = zod_1.z.object({
    email: zod_1.z.string({
        required_error: "L'adresse email est obligatoire",
    })
        .email("L'adresse email n'est pas valide") // Assure que l'email est valide
        .refine((value) => __awaiter(void 0, void 0, void 0, function* () { return yield (0, exports.verifiEmail)(value); }), "L'adresse email existe déjà"),
    password: zod_1.z.string({
        required_error: "Le mot de passe est obligatoire",
    })
        .min(6, "Le mot de passe doit contenir au moins 6 caractères"), // Assure que le mot de passe est suffisamment long
    clientId: zod_1.z.number({
        required_error: "Le clientId est obligatoire",
    })
        .int("Le clientId doit être un nombre entier")
        .refine((value) => __awaiter(void 0, void 0, void 0, function* () { return yield (0, exports.verifiClientId)(value); }), "Le clientId spécifié n'existe pas"),
    role: zod_1.z.enum(["ADMIN", "BOUTIQUIER"], {
        required_error: "Le rôle est obligatoire",
    })
});
