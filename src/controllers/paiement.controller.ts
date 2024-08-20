import { Request, Response } from "express";
import prisma from "../config/prisma.config";
import RestResponse from "../core/response";
import { StatusCodes } from "http-status-codes";

export class PaiementController {
    // Ajouter un paiement pour une dette spécifique
   async store(req: Request, res: Response) {
    try {
        const detteId = parseInt(req.params.id);
        const montant = parseFloat(req.body.montant);
        const date = new Date(req.body.date);

        // Validation des données d'entrée
        if (isNaN(detteId) || isNaN(montant) || !(date instanceof Date) || montant <= 0) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                message: 'Données invalides. Veuillez vérifier l\'ID, le montant et la date.',
            });
        }

        // Vérifier l'existence de la dette
        const dette = await prisma.dette.findUnique({
            where: { id: detteId },
        });

        if (!dette) {
            return res.status(StatusCodes.NOT_FOUND).json({
                message: `La dette avec l'ID ${detteId} n'existe pas.`,
            });
        }

        // Calculer le montant restant dû
        const montantRestant = dette.montantDue - dette.montantVerser;

        // Vérifier que le montant du paiement ne dépasse pas le montant restant dû
        if (montant > montantRestant) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                message: `Le montant du paiement (${montant}) ne peut pas dépasser le montant restant dû de ${montantRestant}.`,
            });
        }

        // Créer le paiement
        const paiement = await prisma.paiement.create({
            data: {
                montant,
                detteId,
                date : new Date()
            },
        });

        // Mettre à jour le montant versé et le montant dû dans la dette
        const updatedDette = await prisma.dette.update({
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

        res.status(StatusCodes.CREATED).json(RestResponse.response({
            paiement,
            updatedDette,
        }, StatusCodes.CREATED));
    } catch (error: any) {
        console.error('Error creating payment:', error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(RestResponse.response(error.message, StatusCodes.INTERNAL_SERVER_ERROR));
    }
}

    // Afficher tous les paiements pour une dette spécifique
        async getPaiementsForDette(req: Request, res: Response) {
            try {
                const detteId = parseInt(req.params.id);
        
                // Vérifier si l'ID de la dette est valide
                if (isNaN(detteId)) {
                    return res.status(StatusCodes.BAD_REQUEST).json({
                        message: 'ID de la dette invalide.',
                    });
                }
        
                // Vérifier l'existence de la dette
                const detteExists = await prisma.dette.findUnique({
                    where: { id: detteId },
                });
        
                if (!detteExists) {
                    return res.status(StatusCodes.NOT_FOUND).json({
                        message: `La dette avec l'ID ${detteId} n'existe pas.`,
                    });
                }
        
                // Récupérer les paiements associés à la dette
                const paiements = await prisma.paiement.findMany({
                    where: { detteId },
                });
        
                res.status(StatusCodes.OK).json(RestResponse.response(paiements, StatusCodes.OK));
            } catch (error:any) {
                console.error('Error retrieving payments for debt:', error);
                res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(RestResponse.response(error.message, StatusCodes.INTERNAL_SERVER_ERROR));
            }
        }
        
        async getArticlesForDette(req: Request, res: Response) {
            try {
                const detteId = parseInt(req.params.id);
        
                // Vérifier si l'ID de la dette est valide
                if (isNaN(detteId)) {
                    return res.status(StatusCodes.BAD_REQUEST).json({
                        message: 'ID de la dette invalide.',
                    });
                }
        
                // Vérifier l'existence de la dette
                const detteExists = await prisma.dette.findUnique({
                    where: { id: detteId },
                });
        
                if (!detteExists) {
                    return res.status(StatusCodes.NOT_FOUND).json({
                        message: `La dette avec l'ID ${detteId} n'existe pas.`,
                    });
                }
        
                // Récupérer les articles associés à la dette
                const articles = await prisma.articleDette.findMany({
                    where: { detteId },
                    include: {
                        article: true, // Inclure les détails de l'article
                    },
                });
        
                res.status(StatusCodes.OK).json(RestResponse.response(articles, StatusCodes.OK));
            } catch (error:any) {
                console.error('Error retrieving articles for debt:', error);
                res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(RestResponse.response(error.message, StatusCodes.INTERNAL_SERVER_ERROR));
            }
        }

        async show(req: Request, res: Response) {
            try {
                // Récupérer tous les paiements
                const paiements = await prisma.paiement.findMany({
                    include: {
                        dette: true, // Inclure les détails de la dette associée
                    },
                });
        
                res.status(StatusCodes.OK).json(RestResponse.response(paiements, StatusCodes.OK));
            } catch (error: any) {
                console.error('Error retrieving payments:', error);
                res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(RestResponse.response(error.message, StatusCodes.INTERNAL_SERVER_ERROR));
            }
        }

}

    

