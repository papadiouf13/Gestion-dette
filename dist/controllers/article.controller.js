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
exports.ArticleController = void 0;
const controller_1 = __importDefault(require("../core/impl/controller"));
const prisma_config_1 = __importDefault(require("../config/prisma.config"));
const response_1 = __importDefault(require("../core/response"));
const http_status_codes_1 = require("http-status-codes");
class ArticleController extends controller_1.default {
    store(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { libelle, prix, quantiteStock } = req.body;
                const newData = yield prisma_config_1.default.article.create({
                    data: {
                        libelle,
                        prix,
                        quantiteStock
                    },
                });
                // Envoi de la réponse avec le statut 201 (Created) pour indiquer que la ressource a été créée avec succès
                res.status(http_status_codes_1.StatusCodes.CREATED)
                    .send(response_1.default.response(newData, http_status_codes_1.StatusCodes.CREATED));
            }
            catch (error) {
                // Afficher l'erreur dans la console pour le débogage
                console.error('Erreur lors de la création de l\'article :', error);
                // Renvoyer une réponse avec le statut 400 (Bad Request) pour indiquer une erreur de validation
                res.status(http_status_codes_1.StatusCodes.BAD_REQUEST)
                    .send(response_1.default.response({
                    name: error.name,
                    message: error.message,
                }, http_status_codes_1.StatusCodes.BAD_REQUEST));
            }
        });
    }
    show(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const newData = yield prisma_config_1.default.article.findMany({
                    select: {
                        id: true,
                        libelle: true,
                        prix: true,
                        quantiteStock: true,
                    }
                });
                res.status(http_status_codes_1.StatusCodes.OK)
                    .send(response_1.default.response(newData, http_status_codes_1.StatusCodes.OK));
            }
            catch (error) {
                res.status(http_status_codes_1.StatusCodes.NOT_FOUND)
                    .send(response_1.default.response(error, http_status_codes_1.StatusCodes.NOT_FOUND));
            }
        });
    }
    edit(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const newData = yield prisma_config_1.default.article.findFirstOrThrow({
                    where: {
                        id: parseInt(req.params.id)
                    },
                    select: {
                        id: true,
                        libelle: true,
                        prix: true,
                        quantiteStock: true,
                    }
                });
                res.status(http_status_codes_1.StatusCodes.OK)
                    .send(response_1.default.response(newData, http_status_codes_1.StatusCodes.OK));
            }
            catch (error) {
                res.status(http_status_codes_1.StatusCodes.NOT_FOUND)
                    .send(response_1.default.response(error, http_status_codes_1.StatusCodes.NOT_FOUND));
            }
        });
    }
    editByStock(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const articleId = parseInt(req.params.id);
                const ajoutStock = parseInt(req.body.quantiteStock);
                // Vérifier si l'article existe et récupérer sa quantité actuelle
                const article = yield prisma_config_1.default.article.findUniqueOrThrow({
                    where: { id: articleId },
                    select: {
                        id: true,
                        libelle: true,
                        prix: true,
                        quantiteStock: true, // Récupérer la quantité actuelle en stock
                    }
                });
                // Calculer la nouvelle quantité en stock
                const nouveauStock = article.quantiteStock + ajoutStock;
                // Mettre à jour la quantité en stock de l'article
                const updatedArticle = yield prisma_config_1.default.article.update({
                    where: { id: articleId },
                    data: { quantiteStock: nouveauStock },
                    select: {
                        id: true,
                        libelle: true,
                        prix: true,
                        quantiteStock: true,
                    }
                });
                res.status(http_status_codes_1.StatusCodes.OK)
                    .send(response_1.default.response(updatedArticle, http_status_codes_1.StatusCodes.OK));
            }
            catch (error) {
                if (error.name === 'NotFoundError') {
                    // Si l'article n'existe pas, retourner une erreur 404
                    res.status(http_status_codes_1.StatusCodes.NOT_FOUND)
                        .send(response_1.default.response({ message: `L'article avec l'ID ${req.params.id} n'existe pas.` }, http_status_codes_1.StatusCodes.NOT_FOUND));
                }
                else {
                    // Gérer d'autres erreurs
                    res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR)
                        .send(response_1.default.response(error, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR));
                }
            }
        });
    }
}
exports.ArticleController = ArticleController;
