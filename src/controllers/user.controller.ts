import { Request, Response } from "express";
import Controller from "../core/impl/controller";
import prisma from "../config/prisma.config";
import RestResponse from "../core/response";
import { StatusCodes } from "http-status-codes";
import { encrypt } from "../helpers/encrypt";
import { Role } from "@prisma/client"; // Importez l'énumération Role depuis Prisma

export class UserController extends Controller {

  async register(req: Request, res: Response) {
    try {
      const { email, password, clientId, role } = req.body;

      // Vérifier si l'utilisateur existe déjà
      const existingUser = await prisma.user.findUnique({
        where: { email },
      });

      if (existingUser) {
        return res.status(StatusCodes.CONFLICT).json(
          RestResponse.response(null, StatusCodes.CONFLICT, 'Utilisateur déjà existant.')
        );
      }

      // Vérifier si le clientId existe
      const existingClient = await prisma.client.findUnique({
        where: { id: clientId },
      });

      if (!existingClient) {
        return res.status(StatusCodes.BAD_REQUEST).json(
          RestResponse.response(null, StatusCodes.BAD_REQUEST, 'Le clientId spécifié n\'existe pas.')
        );
      }

      // Valider le rôle
      if (!['ADMIN', 'BOUTIQUIER'].includes(role)) {
        return res.status(StatusCodes.BAD_REQUEST).json(
          RestResponse.response(null, StatusCodes.BAD_REQUEST, 'Le rôle spécifié n\'est pas valide. Utilisez "ADMIN" ou "BOUTIQUIER".')
        );
      }

      // Hachage du mot de passe
      const hashedPassword = await encrypt.encryptpass(password);

      // Création de l'utilisateur
      const newUser = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          clientId,
          role,
        },
      });

      res.status(StatusCodes.CREATED).json(
        RestResponse.response(newUser, StatusCodes.CREATED, 'Utilisateur créé avec succès')
      );
    } catch (error: any) {
      console.error('Error registering user:', error);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(
        RestResponse.response(null, StatusCodes.INTERNAL_SERVER_ERROR, 'Erreur lors de l\'enregistrement de l\'utilisateur')
      );
    }
  }

  async listUsersByRole(req: Request, res: Response) {
    try {
      // Extraire le rôle depuis les paramètres de requête
      const role = req.query.role as string;

      // Vérifier si le rôle est valide
      if (!['ADMIN', 'BOUTIQUIER', 'CLIENT'].includes(role)) {
        return res.status(StatusCodes.BAD_REQUEST).json(
          RestResponse.response(null, StatusCodes.BAD_REQUEST, 'Le rôle spécifié n\'est pas valide. Utilisez "ADMIN" ou "BOUTIQUIER" OU "CLIENT".')
        );
      }

      // Convertir le rôle en type Role
      const roleEnum = role as Role;

      // Trouver les utilisateurs avec le rôle spécifié
      const users = await prisma.user.findMany({
        where: { role: roleEnum },
        include: {
          client: true, // Inclure les informations du client si nécessaire
        },
      });

      // Répondre avec les utilisateurs trouvés
      res.status(StatusCodes.OK).json(
        RestResponse.response(users, StatusCodes.OK, 'Utilisateurs récupérés avec succès')
      );
    } catch (error: any) {
      console.error('Error listing users by role:', error);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(
        RestResponse.response(null, StatusCodes.INTERNAL_SERVER_ERROR, 'Erreur lors de la récupération des utilisateurs')
      );
    }
  }
}
