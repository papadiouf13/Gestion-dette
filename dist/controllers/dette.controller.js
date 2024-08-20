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
exports.DetteController = void 0;
const controller_1 = __importDefault(require("../core/impl/controller"));
const prisma_config_1 = __importDefault(require("../config/prisma.config"));
const response_1 = __importDefault(require("../core/response"));
const http_status_codes_1 = require("http-status-codes");
class DetteController extends controller_1.default {
    store(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { clientId, date, montantVerser, articles } = req.body;
            const transaction = () => __awaiter(this, void 0, void 0, function* () {
                // Vérifier l'existence du client
                const client = yield prisma_config_1.default.client.findUnique({
                    where: { id: clientId },
                });
                if (!client) {
                    throw new Error(`Le client avec l'ID ${clientId} n'existe pas.`);
                }
                let montantTotal = 0;
                for (const article of articles) {
                    const articleData = yield prisma_config_1.default.article.findUnique({
                        where: { id: article.articleId },
                    });
                    if (!articleData) {
                        throw new Error(`L'article avec l'ID ${article.articleId} n'existe pas.`);
                    }
                    if (article.quantiteArticleDette > articleData.quantiteStock) {
                        throw new Error(`La quantité demandée pour l'article ${articleData.libelle} dépasse la quantité en stock.`);
                    }
                    // Calcul du montant total dû
                    montantTotal += articleData.prix * article.quantiteArticleDette;
                }
                // Vérification que le montant versé ne dépasse pas le montant total dû
                if (montantVerser > montantTotal) {
                    throw new Error(`Le montant versé (${montantVerser}) ne peut pas dépasser le montant total dû (${montantTotal}).`);
                }
                const montantDue = montantTotal - montantVerser;
                // Créer la dette avec les articles associés
                const newDette = yield prisma_config_1.default.dette.create({
                    data: {
                        clientId,
                        date: new Date(),
                        montantDue, // Utiliser le montant calculé
                        montantVerser,
                        ArticleDette: {
                            create: articles.map((article) => ({
                                articleId: article.articleId,
                                quantiteArticleDette: article.quantiteArticleDette,
                            })),
                        },
                    },
                    include: {
                        client: {
                            select: {
                                id: true,
                                nom: true,
                                prenom: true,
                                telephone: true,
                            },
                        },
                        ArticleDette: {
                            select: {
                                articleId: true,
                                quantiteArticleDette: true,
                                article: {
                                    select: {
                                        id: true,
                                        libelle: true,
                                    },
                                },
                            },
                        },
                    },
                });
                let newPaiement = null;
                // Créer le paiement correspondant au montant versé, si montantVerser > 0
                if (montantVerser > 0) {
                    newPaiement = yield prisma_config_1.default.paiement.create({
                        data: {
                            montant: montantVerser,
                            date: new Date(), // Utiliser la date actuelle
                            detteId: newDette.id, // Associer ce paiement à la dette créée
                        },
                    });
                }
                // Mise à jour du stock des articles
                yield Promise.all(articles.map((article) => __awaiter(this, void 0, void 0, function* () {
                    yield prisma_config_1.default.article.update({
                        where: { id: article.articleId },
                        data: {
                            quantiteStock: {
                                decrement: article.quantiteArticleDette, // Décrémenter la quantité en stock
                            },
                        },
                    });
                })));
                return { newDette, newPaiement }; // Retourner la dette et le paiement (si créé)
            });
            try {
                const result = yield prisma_config_1.default.$transaction(transaction);
                res.status(http_status_codes_1.StatusCodes.CREATED)
                    .send(response_1.default.response(result, http_status_codes_1.StatusCodes.CREATED));
            }
            catch (error) {
                console.error('Error creating Dette:', error);
                res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR)
                    .send(response_1.default.response(error.message, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR));
            }
        });
    }
    show(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const detteData = yield prisma_config_1.default.dette.findMany({
                    select: {
                        id: true,
                        date: true,
                        montantDue: true,
                        montantVerser: true,
                        client: {
                            select: {
                                id: true,
                                nom: true,
                                prenom: true,
                                telephone: true
                            }
                        },
                        ArticleDette: {
                            select: {
                                articleId: true,
                                quantiteArticleDette: true,
                                article: {
                                    select: {
                                        id: true,
                                        libelle: true
                                    }
                                }
                            }
                        }
                    }
                });
                res.status(http_status_codes_1.StatusCodes.OK)
                    .send(response_1.default.response(detteData, http_status_codes_1.StatusCodes.OK));
            }
            catch (error) {
                console.error('Error fetching Dettes:', error);
                res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR)
                    .send(response_1.default.response("Erreur lors de la récupération des données", http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR));
            }
        });
    }
    edit(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params; // Récupération de l'ID à partir des paramètres d'URL
                // Vérification si l'ID est bien présent
                if (!id) {
                    return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST)
                        .send(response_1.default.response("ID manquant dans les paramètres de la requête.", http_status_codes_1.StatusCodes.BAD_REQUEST));
                }
                // Conversion de l'ID en entier
                const parsedId = parseInt(id, 10);
                // Vérification si la conversion en entier a réussi
                if (isNaN(parsedId)) {
                    return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST)
                        .send(response_1.default.response("L'ID fourni n'est pas valide.", http_status_codes_1.StatusCodes.BAD_REQUEST));
                }
                // Requête à la base de données avec Prisma pour récupérer la dette
                const detteData = yield prisma_config_1.default.dette.findFirstOrThrow({
                    where: {
                        id: parsedId,
                    },
                    select: {
                        id: true,
                        date: true,
                        montantDue: true,
                        montantVerser: true,
                        client: {
                            select: {
                                id: true,
                                nom: true,
                                prenom: true,
                                telephone: true,
                            },
                        },
                        ArticleDette: {
                            select: {
                                articleId: true,
                                quantiteArticleDette: true,
                                article: {
                                    select: {
                                        id: true,
                                        libelle: true,
                                    },
                                },
                            },
                        },
                    },
                });
                // Réponse réussie avec les données de la dette
                res.status(http_status_codes_1.StatusCodes.OK)
                    .send(response_1.default.response(detteData, http_status_codes_1.StatusCodes.OK));
            }
            catch (error) {
                console.error('Error fetching Dette:', error);
                if (error.name === "NotFoundError") {
                    // Gestion de l'erreur NotFoundError pour findFirstOrThrow
                    return res.status(http_status_codes_1.StatusCodes.NOT_FOUND)
                        .send(response_1.default.response("La dette avec cet ID n'existe pas.", http_status_codes_1.StatusCodes.NOT_FOUND));
                }
                // Réponse générique en cas d'erreur
                res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR)
                    .send(response_1.default.response("Erreur lors de la récupération des données.", http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR));
            }
        });
    }
    editByDate(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const detteData = yield prisma_config_1.default.dette.findMany({
                    where: {
                        date: new Date(req.body.date),
                    },
                    select: {
                        id: true,
                        date: true,
                        montantDue: true,
                        montantVerser: true,
                        client: {
                            select: {
                                id: true,
                                nom: true,
                                prenom: true,
                                telephone: true
                            }
                        },
                        ArticleDette: {
                            select: {
                                articleId: true,
                                quantiteArticleDette: true,
                                article: {
                                    select: {
                                        id: true,
                                        libelle: true
                                    }
                                }
                            }
                        }
                    }
                });
                if (detteData.length === 0) {
                    return res.status(http_status_codes_1.StatusCodes.NOT_FOUND)
                        .send(response_1.default.response("Aucune dette trouvée pour cette date", http_status_codes_1.StatusCodes.NOT_FOUND));
                }
                res.status(http_status_codes_1.StatusCodes.OK)
                    .send(response_1.default.response(detteData, http_status_codes_1.StatusCodes.OK));
            }
            catch (error) {
                console.error('Error fetching Dette by Date:', error);
                res.status(http_status_codes_1.StatusCodes.NOT_FOUND)
                    .send(response_1.default.response("Erreur lors de la récupération des données", http_status_codes_1.StatusCodes.NOT_FOUND));
            }
        });
    }
    filterDettesByStatut(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { statut } = req.query; // Récupération du statut depuis la requête ('solde' ou 'non_solde')
                // Validation du statut
                if (!statut || (statut !== 'solde' && statut !== 'non_solde')) {
                    return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST)
                        .send(response_1.default.response(null, http_status_codes_1.StatusCodes.BAD_REQUEST, "Statut non valide. Utilisez 'solde' ou 'non_solde'."));
                }
                let dettes;
                console.log(`Filtrage par statut: ${statut}`);
                // Filtrage des dettes en fonction du statut
                if (statut === 'solde') {
                    // Filtrer les dettes soldées (montantDue égal à 0)
                    dettes = yield prisma_config_1.default.dette.findMany({
                        where: {
                            montantDue: 0, // Dette soldée lorsque le montant dû est 0
                        },
                        include: {
                            client: true, // Inclure les informations du client
                            ArticleDette: {
                                include: {
                                    article: true, // Inclure les articles liés à la dette
                                },
                            },
                        },
                    });
                }
                else if (statut === 'non_solde') {
                    // Filtrer les dettes non soldées (montantDue supérieur à 0)
                    dettes = yield prisma_config_1.default.dette.findMany({
                        where: {
                            montantDue: {
                                gt: 0, // Dette non soldée lorsque le montant dû est supérieur à 0
                            },
                        },
                        include: {
                            client: true, // Inclure les informations du client
                            ArticleDette: {
                                include: {
                                    article: true, // Inclure les articles liés à la dette
                                },
                            },
                        },
                    });
                }
                // Vérifier si des dettes ont été trouvées
                if (!dettes || dettes.length === 0) {
                    return res.status(http_status_codes_1.StatusCodes.NOT_FOUND)
                        .send(response_1.default.response("Aucune dette trouvée pour ce statut.", http_status_codes_1.StatusCodes.NOT_FOUND));
                }
                // Réponse réussie avec les dettes filtrées
                res.status(http_status_codes_1.StatusCodes.OK)
                    .send(response_1.default.response(dettes, http_status_codes_1.StatusCodes.OK, "Dettes filtrées avec succès"));
            }
            catch (error) {
                console.error('Erreur lors du filtrage des dettes:', error);
                res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR)
                    .send(response_1.default.response(error.message, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, "Erreur lors du filtrage des dettes"));
            }
        });
    }
}
exports.DetteController = DetteController;
