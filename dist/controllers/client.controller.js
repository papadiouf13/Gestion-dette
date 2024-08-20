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
exports.ClientController = void 0;
const controller_1 = __importDefault(require("../core/impl/controller"));
const prisma_config_1 = __importDefault(require("../config/prisma.config"));
const response_1 = __importDefault(require("../core/response"));
const http_status_codes_1 = require("http-status-codes");
const encrypt_1 = require("../helpers/encrypt");
class ClientController extends controller_1.default {
    store(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { nom, prenom, telephone, photo, email, password } = req.body;
                // Cryptage du mot de passe si un mot de passe est fourni
                const hashPassword = password ? yield encrypt_1.encrypt.encryptpass(password) : undefined;
                // Vérification si un utilisateur avec le même email existe déjà
                if (email && password) {
                    const existingUser = yield prisma_config_1.default.user.findUnique({
                        where: { email },
                    });
                }
                // Création du client avec un utilisateur optionnel
                const newData = yield prisma_config_1.default.client.create({
                    data: {
                        nom,
                        prenom,
                        telephone,
                        photo,
                        user: email && password ? {
                            create: {
                                email: email,
                                password: hashPassword,
                            }
                        } : undefined // Ne pas créer un utilisateur si email et password ne sont pas fournis
                    },
                    include: {
                        user: true // Inclure les informations de l'utilisateur dans la réponse
                    }
                });
                res.status(http_status_codes_1.StatusCodes.CREATED)
                    .send(response_1.default.response(newData, http_status_codes_1.StatusCodes.CREATED));
            }
            catch (error) {
                console.log("Error creating client:", error); // Affichez l'erreur pour plus de détails
                res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR)
                    .send(response_1.default.response(error, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, 'Erreur lors de la création du client.'));
            }
        });
    }
    show(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const newData = yield prisma_config_1.default.client.findMany({
                    select: {
                        id: true,
                        nom: true,
                        prenom: true,
                        telephone: true,
                        user: true,
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
                const newData = yield prisma_config_1.default.client.findFirstOrThrow({
                    where: {
                        id: parseInt(req.params.id)
                    },
                    select: {
                        id: true,
                        nom: true,
                        prenom: true,
                        telephone: true,
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
    editByTelephone(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const newData = yield prisma_config_1.default.client.findFirstOrThrow({
                    where: {
                        telephone: req.body.telephone
                    },
                    select: {
                        id: true,
                        nom: true,
                        prenom: true,
                        telephone: true,
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
    // Méthode pour obtenir les dettes d'un client par ID
    getDettesClient(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const clientId = parseInt(req.params.id);
                // Vérifiez que l'ID client est un nombre valide
                if (isNaN(clientId)) {
                    return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST)
                        .send(response_1.default.response(null, http_status_codes_1.StatusCodes.BAD_REQUEST, "ID client invalide."));
                }
                // Vérifiez que le client existe et récupérez ses dettes
                const clientWithDettes = yield prisma_config_1.default.client.findUnique({
                    where: { id: clientId },
                    include: { dettes: true } // Inclure les dettes associées au client
                });
                if (!clientWithDettes) {
                    return res.status(http_status_codes_1.StatusCodes.NOT_FOUND)
                        .send(response_1.default.response(null, http_status_codes_1.StatusCodes.NOT_FOUND, "Client non trouvé."));
                }
                res.status(http_status_codes_1.StatusCodes.OK)
                    .send(response_1.default.response({ dettes: clientWithDettes.dettes }, http_status_codes_1.StatusCodes.OK));
            }
            catch (error) {
                console.error("Error retrieving client debts:", error);
                res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR)
                    .send(response_1.default.response(null, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, "Une erreur est survenue lors de la récupération des dettes du client."));
            }
        });
    }
    // Méthode pour obtenir l'utilisateur d'un client par ID
    getUserClient(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const clientId = parseInt(req.params.id);
                // Vérifiez que l'ID client est un nombre valide
                if (isNaN(clientId)) {
                    return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST)
                        .send(response_1.default.response(null, http_status_codes_1.StatusCodes.BAD_REQUEST, "ID client invalide."));
                }
                // Récupérez le client avec les informations de l'utilisateur associées
                const clientWithUser = yield prisma_config_1.default.client.findUnique({
                    where: { id: clientId },
                    include: { user: true } // Inclure les informations de l'utilisateur associé
                });
                if (!clientWithUser) {
                    return res.status(http_status_codes_1.StatusCodes.NOT_FOUND)
                        .send(response_1.default.response(null, http_status_codes_1.StatusCodes.NOT_FOUND, "Client non trouvé."));
                }
                res.status(http_status_codes_1.StatusCodes.OK)
                    .send(response_1.default.response({ user: clientWithUser.user }, http_status_codes_1.StatusCodes.OK));
            }
            catch (error) {
                console.error("Error retrieving client user:", error);
                res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR)
                    .send(response_1.default.response(null, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, "Une erreur est survenue lors de la récupération des informations utilisateur du client."));
            }
        });
    }
    getDetteClient(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                // Vérifiez si req.user contient bien les informations attendues
                console.log("User from token:", req.body.user);
                const clientId = (_a = req.body.user) === null || _a === void 0 ? void 0 : _a.clientId;
                if (!clientId) {
                    return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST)
                        .send(response_1.default.response(null, http_status_codes_1.StatusCodes.BAD_REQUEST, "Client ID manquant."));
                }
                // Récupération des dettes du client
                const client = yield prisma_config_1.default.client.findUnique({
                    where: { id: clientId },
                    include: { dettes: true },
                });
                if (!client || client.dettes.length === 0) {
                    return res.status(http_status_codes_1.StatusCodes.NOT_FOUND)
                        .send(response_1.default.response(null, http_status_codes_1.StatusCodes.NOT_FOUND, "Aucune dette trouvée pour ce client."));
                }
                res.status(http_status_codes_1.StatusCodes.OK)
                    .send(response_1.default.response(client.dettes, http_status_codes_1.StatusCodes.OK));
            }
            catch (error) {
                console.error("Error getting client debts:", error);
                res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR)
                    .send(response_1.default.response(error, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR));
            }
        });
    }
    getDetteArticleClient(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                // Récupération de l'ID de la dette depuis les paramètres de l'URL
                const { id } = req.params;
                // Récupération du client connecté à partir du token
                const clientId = (_a = req.body.user) === null || _a === void 0 ? void 0 : _a.clientId;
                if (!clientId) {
                    return res.status(http_status_codes_1.StatusCodes.UNAUTHORIZED)
                        .send(response_1.default.response(null, http_status_codes_1.StatusCodes.UNAUTHORIZED, "Client non authentifié."));
                }
                // Rechercher la dette spécifique pour le client et inclure les articles à travers ArticleDette
                const dette = yield prisma_config_1.default.dette.findFirst({
                    where: {
                        id: parseInt(id),
                        clientId: clientId, // Associer la dette au bon client
                    },
                    include: {
                        ArticleDette: {
                            include: {
                                article: true, // Inclure les détails des articles associés
                            },
                        },
                    },
                });
                // Vérifier si la dette ou les articles n'existent pas
                if (!dette || dette.ArticleDette.length === 0) {
                    return res.status(http_status_codes_1.StatusCodes.NOT_FOUND)
                        .send(response_1.default.response(null, http_status_codes_1.StatusCodes.NOT_FOUND, "Dette ou articles non trouvés pour ce client."));
                }
                // Récupération des articles liés à cette dette
                const articles = dette.ArticleDette.map(ad => ad.article);
                res.status(http_status_codes_1.StatusCodes.OK)
                    .send(response_1.default.response(articles, http_status_codes_1.StatusCodes.OK, "Articles récupérés avec succès."));
            }
            catch (error) {
                console.error("Error getting debt articles:", error);
                res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR)
                    .send(response_1.default.response(error, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR));
            }
        });
    }
    getPaiementDetteClient(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                // Récupération de l'ID de la dette depuis les paramètres de l'URL
                const { id } = req.params;
                // Vérification de ce qui est injecté dans req.user
                console.log("User from token:", req.body.user);
                // Récupération du client connecté à partir du token
                const clientId = (_a = req.body.user) === null || _a === void 0 ? void 0 : _a.clientId;
                // Vérification que clientId est bien défini
                if (!clientId) {
                    return res.status(http_status_codes_1.StatusCodes.UNAUTHORIZED)
                        .send(response_1.default.response(null, http_status_codes_1.StatusCodes.UNAUTHORIZED, "Client non authentifié."));
                }
                // Vérifier si la dette appartient au client et récupérer les paiements associés
                const paiements = yield prisma_config_1.default.paiement.findMany({
                    where: {
                        detteId: parseInt(id)
                    },
                });
                // Vérifier si des paiements existent pour cette dette
                if (!paiements || paiements.length === 0) {
                    return res.status(http_status_codes_1.StatusCodes.NOT_FOUND)
                        .send(response_1.default.response(null, http_status_codes_1.StatusCodes.NOT_FOUND, "Aucun paiement trouvé pour cette dette ou client non associé."));
                }
                res.status(http_status_codes_1.StatusCodes.OK)
                    .send(response_1.default.response(paiements, http_status_codes_1.StatusCodes.OK, "Paiements récupérés avec succès."));
            }
            catch (error) {
                console.error("Error getting debt payments:", error);
                // Gestion des erreurs plus explicite
                res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR)
                    .send(response_1.default.response(null, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, "Erreur lors de la récupération des paiements."));
            }
        });
    }
}
exports.ClientController = ClientController;
