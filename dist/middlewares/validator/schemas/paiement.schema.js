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
exports.paiementPostSchema = exports.verifiDetteId = void 0;
const zod_1 = require("zod");
const app_1 = __importDefault(require("../../../app"));
// Validation pour vérifier si une dette existe
const verifiDetteId = (value) => __awaiter(void 0, void 0, void 0, function* () {
    const count = yield app_1.default.prisma.dette.count({
        where: { id: value },
    });
    return count > 0;
});
exports.verifiDetteId = verifiDetteId;
// Schéma de validation pour la création de paiement
exports.paiementPostSchema = zod_1.z.object({
    montant: zod_1.z.number({
        required_error: "Le montant est obligatoire",
    }).positive("Le montant doit être positif"),
    detteId: zod_1.z.number({
        required_error: "L'ID de la dette est obligatoire",
    }).int("L'ID de la dette doit être un entier").refine(exports.verifiDetteId, "La dette associée n'existe pas")
});
