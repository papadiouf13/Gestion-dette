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
exports.AuthController = void 0;
const client_1 = require("@prisma/client");
const dotenv_1 = __importDefault(require("dotenv"));
const encrypt_1 = require("../helpers/encrypt");
const http_status_codes_1 = require("http-status-codes");
dotenv_1.default.config();
const prisma = new client_1.PrismaClient();
class AuthController {
    register(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, password, clientId, role } = req.body;
                // Vérifier si le rôle est CLIENT
                if (role !== 'CLIENT') {
                    return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
                        message: 'Le rôle spécifié n\'est pas valide. Seul le rôle "CLIENT" est autorisé.'
                    });
                }
                // Vérifier si l'utilisateur existe déjà
                const existingUser = yield prisma.user.findUnique({
                    where: { email },
                });
                if (existingUser) {
                    return res.status(http_status_codes_1.StatusCodes.CONFLICT).json({
                        message: 'Utilisateur déjà existant.',
                    });
                }
                // Vérifier si le clientId existe
                const existingClient = yield prisma.client.findUnique({
                    where: { id: clientId },
                });
                if (!existingClient) {
                    return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
                        message: 'Le clientId spécifié n\'existe pas.',
                    });
                }
                // Hachage du mot de passe
                const hashedPassword = yield encrypt_1.encrypt.encryptpass(password);
                // Création de l'utilisateur avec le rôle CLIENT
                const newUser = yield prisma.user.create({
                    data: {
                        email,
                        password: hashedPassword,
                        clientId,
                        role: 'CLIENT', // Assigner le rôle CLIENT
                    },
                });
                res.status(http_status_codes_1.StatusCodes.CREATED).json({
                    message: 'Utilisateur créé avec succès',
                    user: newUser,
                });
            }
            catch (error) {
                console.error('Error registering user:', error);
                res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
                    message: 'Erreur lors de l\'enregistrement de l\'utilisateur',
                });
            }
        });
    }
    login(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, password } = req.body;
            try {
                // Trouver l'utilisateur
                const user = yield prisma.user.findUnique({
                    where: { email },
                    select: {
                        id: true,
                        email: true,
                        password: true,
                        role: true,
                        client: {
                            select: {
                                id: true,
                                nom: true,
                                prenom: true,
                                telephone: true
                            }
                        }
                    }
                });
                if (!user) {
                    return res.status(http_status_codes_1.StatusCodes.UNAUTHORIZED).json({ message: 'Email ou mot de passe incorrect' });
                }
                // Vérifier le mot de passe en utilisant Encrypt
                const isMatch = yield encrypt_1.encrypt.comparepassword(user.password, password);
                if (!isMatch) {
                    return res.status(http_status_codes_1.StatusCodes.UNAUTHORIZED).json({ message: 'Email ou mot de passe incorrect' });
                }
                // Générer un token JWT en utilisant Encrypt
                const token = encrypt_1.encrypt.generateToken({
                    id: user.id,
                    login: user.email,
                    role: user.role,
                    clientId: user.client.id,
                });
                res.status(http_status_codes_1.StatusCodes.OK).json({ token });
            }
            catch (error) {
                console.error('Error logging in:', error);
                res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Erreur lors de la connexion' });
            }
        });
    }
}
exports.AuthController = AuthController;
