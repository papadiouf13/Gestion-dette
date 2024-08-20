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
exports.UserController = void 0;
const controller_1 = __importDefault(require("../core/impl/controller"));
const prisma_config_1 = __importDefault(require("../config/prisma.config"));
const response_1 = __importDefault(require("../core/response"));
const http_status_codes_1 = require("http-status-codes");
const encrypt_1 = require("../helpers/encrypt");
class UserController extends controller_1.default {
    register(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, password, clientId, role } = req.body;
                // Vérifier si l'utilisateur existe déjà
                const existingUser = yield prisma_config_1.default.user.findUnique({
                    where: { email },
                });
                if (existingUser) {
                    return res.status(http_status_codes_1.StatusCodes.CONFLICT).json(response_1.default.response(null, http_status_codes_1.StatusCodes.CONFLICT, 'Utilisateur déjà existant.'));
                }
                // Vérifier si le clientId existe
                const existingClient = yield prisma_config_1.default.client.findUnique({
                    where: { id: clientId },
                });
                if (!existingClient) {
                    return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json(response_1.default.response(null, http_status_codes_1.StatusCodes.BAD_REQUEST, 'Le clientId spécifié n\'existe pas.'));
                }
                // Valider le rôle
                if (!['ADMIN', 'BOUTIQUIER'].includes(role)) {
                    return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json(response_1.default.response(null, http_status_codes_1.StatusCodes.BAD_REQUEST, 'Le rôle spécifié n\'est pas valide. Utilisez "ADMIN" ou "BOUTIQUIER".'));
                }
                // Hachage du mot de passe
                const hashedPassword = yield encrypt_1.encrypt.encryptpass(password);
                // Création de l'utilisateur
                const newUser = yield prisma_config_1.default.user.create({
                    data: {
                        email,
                        password: hashedPassword,
                        clientId,
                        role,
                    },
                });
                res.status(http_status_codes_1.StatusCodes.CREATED).json(response_1.default.response(newUser, http_status_codes_1.StatusCodes.CREATED, 'Utilisateur créé avec succès'));
            }
            catch (error) {
                console.error('Error registering user:', error);
                res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json(response_1.default.response(null, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, 'Erreur lors de l\'enregistrement de l\'utilisateur'));
            }
        });
    }
    listUsersByRole(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Extraire le rôle depuis les paramètres de requête
                const role = req.query.role;
                // Vérifier si le rôle est valide
                if (!['ADMIN', 'BOUTIQUIER', 'CLIENT'].includes(role)) {
                    return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json(response_1.default.response(null, http_status_codes_1.StatusCodes.BAD_REQUEST, 'Le rôle spécifié n\'est pas valide. Utilisez "ADMIN" ou "BOUTIQUIER" OU "CLIENT".'));
                }
                // Convertir le rôle en type Role
                const roleEnum = role;
                // Trouver les utilisateurs avec le rôle spécifié
                const users = yield prisma_config_1.default.user.findMany({
                    where: { role: roleEnum },
                    include: {
                        client: true, // Inclure les informations du client si nécessaire
                    },
                });
                // Répondre avec les utilisateurs trouvés
                res.status(http_status_codes_1.StatusCodes.OK).json(response_1.default.response(users, http_status_codes_1.StatusCodes.OK, 'Utilisateurs récupérés avec succès'));
            }
            catch (error) {
                console.error('Error listing users by role:', error);
                res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json(response_1.default.response(null, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, 'Erreur lors de la récupération des utilisateurs'));
            }
        });
    }
}
exports.UserController = UserController;
