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
exports.clientPostSchema = exports.verifiLiTelephone = void 0;
const zod_1 = require("zod");
const app_1 = __importDefault(require("../../../app"));
// Fonction pour vérifier l'unicité du numéro de téléphone
const verifiLiTelephone = (value) => __awaiter(void 0, void 0, void 0, function* () {
    const count = yield app_1.default.prisma.client.count({
        where: { telephone: value },
    });
    return count < 1;
});
exports.verifiLiTelephone = verifiLiTelephone;
// Schéma de validation pour les clients
exports.clientPostSchema = zod_1.z.object({
    nom: zod_1.z.string({
        required_error: "Le nom est obligatoire",
    })
        .min(1, "Le nom ne doit pas être vide"), // Assure que le champ n'est pas vide
    prenom: zod_1.z.string({
        required_error: "Le prénom est obligatoire",
    })
        .min(1, "Le prénom ne doit pas être vide"), // Assure que le champ n'est pas vide
    telephone: zod_1.z.string({
        required_error: "Le téléphone est obligatoire",
    })
        .length(9, "Le téléphone doit contenir 9 chiffres")
        .refine((value) => __awaiter(void 0, void 0, void 0, function* () { return yield (0, exports.verifiLiTelephone)(value); }), "Le téléphone existe déjà"),
    photo: zod_1.z.string({
        required_error: "La photo est obligatoire",
    })
        .min(1, "La photo ne doit pas être vide") // Assure que le champ n'est pas vide
});
