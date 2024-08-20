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
exports.PaiementController = void 0;
const prisma_config_1 = __importDefault(require("../config/prisma.config"));
const response_1 = __importDefault(require("../core/response"));
const http_status_codes_1 = require("http-status-codes");
class PaiementController {
    // Ajouter un paiement pour une dette spécifique
    store(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const detteId = parseInt(req.params.id);
                const montant = parseFloat(req.body.montant);
                const date = new Date(req.body.date);
                // Validation des données d'entrée
                if (isNaN(detteId) || isNaN(montant) || !(date instanceof Date) || montant <= 0) {
                    return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
                        message: 'Données invalides. Veuillez vérifier l\'ID, le montant et la date.',
                    });
                }
                // Vérifier l'existence de la dette
                const dette = yield prisma_config_1.default.dette.findUnique({
                    where: { id: detteId },
                });
                if (!dette) {
                    return res.status(http_status_codes_1.StatusCodes.NOT_FOUND).json({
                        message: `La dette avec l'ID ${detteId} n'existe pas.`,
                    });
                }
                // Calculer le montant restant dû
                const montantRestant = dette.montantDue - dette.montantVerser;
                // Vérifier que le montant du paiement ne dépasse pas le montant restant dû
                if (montant > montantRestant) {
                    return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
                        message: `Le montant du paiement (${montant}) ne peut pas dépasser le montant restant dû de ${montantRestant}.`,
                    });
                }
                // Créer le paiement
                const paiement = yield prisma_config_1.default.paiement.create({
                    data: {
                        montant,
                        detteId,
                        date: new Date()
                    },
                });
                // Mettre à jour le montant versé et le montant dû dans la dette
                const updatedDette = yield prisma_config_1.default.dette.update({
                    where: { id: detteId },
                    data: {
                        montantVerser: {
                            increment: montant, // Ajouter le montant du paiement au montant versé
                        },
                        montantDue: {
                            decrement: montant, // Diminuer le montant dû du montant du paiement
                        },
                    },
                });
                res.status(http_status_codes_1.StatusCodes.CREATED).json(response_1.default.response({
                    paiement,
                    updatedDette,
                }, http_status_codes_1.StatusCodes.CREATED));
            }
            catch (error) {
                console.error('Error creating payment:', error);
                res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json(response_1.default.response(error.message, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR));
            }
        });
    }
    // Afficher tous les paiements pour une dette spécifique
    getPaiementsForDette(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const detteId = parseInt(req.params.id);
                // Vérifier si l'ID de la dette est valide
                if (isNaN(detteId)) {
                    return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
                        message: 'ID de la dette invalide.',
                    });
                }
                // Vérifier l'existence de la dette
                const detteExists = yield prisma_config_1.default.dette.findUnique({
                    where: { id: detteId },
                });
                if (!detteExists) {
                    return res.status(http_status_codes_1.StatusCodes.NOT_FOUND).json({
                        message: `La dette avec l'ID ${detteId} n'existe pas.`,
                    });
                }
                // Récupérer les paiements associés à la dette
                const paiements = yield prisma_config_1.default.paiement.findMany({
                    where: { detteId },
                });
                res.status(http_status_codes_1.StatusCodes.OK).json(response_1.default.response(paiements, http_status_codes_1.StatusCodes.OK));
            }
            catch (error) {
                console.error('Error retrieving payments for debt:', error);
                res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json(response_1.default.response(error.message, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR));
            }
        });
    }
    getArticlesForDette(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const detteId = parseInt(req.params.id);
                // Vérifier si l'ID de la dette est valide
                if (isNaN(detteId)) {
                    return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
                        message: 'ID de la dette invalide.',
                    });
                }
                // Vérifier l'existence de la dette
                const detteExists = yield prisma_config_1.default.dette.findUnique({
                    where: { id: detteId },
                });
                if (!detteExists) {
                    return res.status(http_status_codes_1.StatusCodes.NOT_FOUND).json({
                        message: `La dette avec l'ID ${detteId} n'existe pas.`,
                    });
                }
                // Récupérer les articles associés à la dette
                const articles = yield prisma_config_1.default.articleDette.findMany({
                    where: { detteId },
                    include: {
                        article: true, // Inclure les détails de l'article
                    },
                });
                res.status(http_status_codes_1.StatusCodes.OK).json(response_1.default.response(articles, http_status_codes_1.StatusCodes.OK));
            }
            catch (error) {
                console.error('Error retrieving articles for debt:', error);
                res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json(response_1.default.response(error.message, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR));
            }
        });
    }
    show(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Récupérer tous les paiements
                const paiements = yield prisma_config_1.default.paiement.findMany({
                    include: {
                        dette: true, // Inclure les détails de la dette associée
                    },
                });
                res.status(http_status_codes_1.StatusCodes.OK).json(response_1.default.response(paiements, http_status_codes_1.StatusCodes.OK));
            }
            catch (error) {
                console.error('Error retrieving payments:', error);
                res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json(response_1.default.response(error.message, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR));
            }
        });
    }
}
exports.PaiementController = PaiementController;
