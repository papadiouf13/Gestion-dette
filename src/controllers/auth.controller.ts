import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import { encrypt } from '../helpers/encrypt';
import { StatusCodes } from 'http-status-codes';
import app from '../app';

dotenv.config();

const prisma = new PrismaClient();

export class AuthController {
  async register(req: Request, res: Response) {
    try {
      const { email, password, clientId, role } = req.body;

      // Vérifier si le rôle est CLIENT
      if (role !== 'CLIENT') {
        return res.status(StatusCodes.BAD_REQUEST).json({
          message: 'Le rôle spécifié n\'est pas valide. Seul le rôle "CLIENT" est autorisé.'
        });
      }

      // Vérifier si l'utilisateur existe déjà
      const existingUser = await prisma.user.findUnique({
        where: { email },
      });

      if (existingUser) {
        return res.status(StatusCodes.CONFLICT).json({
          message: 'Utilisateur déjà existant.',
        });
      }

      // Vérifier si le clientId existe
      const existingClient = await prisma.client.findUnique({
        where: { id: clientId },
      });

      if (!existingClient) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          message: 'Le clientId spécifié n\'existe pas.',
        });
      }

      // Hachage du mot de passe
      const hashedPassword = await encrypt.encryptpass(password);

      // Création de l'utilisateur avec le rôle CLIENT
      const newUser = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          clientId,
          role: 'CLIENT', // Assigner le rôle CLIENT
        },
      });

      res.status(StatusCodes.CREATED).json({
        message: 'Utilisateur créé avec succès',
        user: newUser,
      });
    } catch (error: any) {
      console.error('Error registering user:', error);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: 'Erreur lors de l\'enregistrement de l\'utilisateur',
      });
    }
  }
  
  async login(req: Request, res: Response) {
    const { email, password } = req.body;

    try {
      // Trouver l'utilisateur
      const user = await prisma.user.findUnique({
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
        return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Email ou mot de passe incorrect' });
      }

      // Vérifier le mot de passe en utilisant Encrypt
      const isMatch = await encrypt.comparepassword(user.password, password);

      if (!isMatch) {
        return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Email ou mot de passe incorrect' });
      }

      // Générer un token JWT en utilisant Encrypt
      const token = encrypt.generateToken({
        id: user.id,
        login: user.email,
        role: user.role,
        clientId: user.client.id,
      });

      res.status(StatusCodes.OK).json({ token });
    } catch (error) {
      console.error('Error logging in:', error);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Erreur lors de la connexion' });
    }
  }
}
