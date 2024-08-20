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
exports.articlePostSchema = exports.verifiLibelle = void 0;
const zod_1 = require("zod");
const app_1 = __importDefault(require("../../../app"));
const verifiLibelle = (value) => __awaiter(void 0, void 0, void 0, function* () {
    const count = yield app_1.default.prisma.article.count({
        where: { libelle: value },
    });
    return count < 1;
});
exports.verifiLibelle = verifiLibelle;
exports.articlePostSchema = zod_1.z.object({
    libelle: zod_1.z.string({
        required_error: "le libelle est obligatoire",
    }).min(1, "Le libelle ne doit pas être vide")
        .refine(exports.verifiLibelle, "le lielle existe deja"),
    prix: zod_1.z.number().positive({
        message: "le prix doit etre positive",
    }).min(1, "Le prix ne doit pas être vide"),
    quantiteStock: zod_1.z.number().positive({
        message: "la quantite doit etre positive",
    }).min(1, "Le quantiteStock ne doit pas être vide"),
});
