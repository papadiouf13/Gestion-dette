import { Request, Response } from "express";
import Controller from "../core/impl/controller";
import prisma from "../config/prisma.config";
import RestResponse from "../core/response";
import { StatusCodes } from "http-status-codes";

export class DetteController extends Controller {  
  async store(req: Request, res: Response) {
    const { clientId, date, montantVerser, articles } = req.body;

    const transaction = async () => {
        // Vérifier l'existence du client
        const client = await prisma.client.findUnique({
            where: { id: clientId },
        });

        if (!client) {
            throw new Error(`Le client avec l'ID ${clientId} n'existe pas.`);
        }

        let montantTotal = 0;

        for (const article of articles) {
            const articleData = await prisma.article.findUnique({
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
        const newDette = await prisma.dette.create({
            data: {
                clientId,
                date : new Date(),
                montantDue, // Utiliser le montant calculé
                montantVerser,
                ArticleDette: {
                    create: articles.map((article: any) => ({
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
            newPaiement = await prisma.paiement.create({
                data: {
                    montant: montantVerser,
                    date: new Date(), // Utiliser la date actuelle
                    detteId: newDette.id, // Associer ce paiement à la dette créée
                },
            });
        }

        // Mise à jour du stock des articles
        await Promise.all(
            articles.map(async (article: any) => {
                await prisma.article.update({
                    where: { id: article.articleId },
                    data: {
                        quantiteStock: {
                            decrement: article.quantiteArticleDette, // Décrémenter la quantité en stock
                        },
                    },
                });
            })
        );

        return { newDette, newPaiement }; // Retourner la dette et le paiement (si créé)
    };

    try {
        const result = await prisma.$transaction(transaction);

        res.status(StatusCodes.CREATED)
            .send(RestResponse.response(result, StatusCodes.CREATED));
    } catch (error: any) {
        console.error('Error creating Dette:', error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR)
            .send(RestResponse.response(error.message, StatusCodes.INTERNAL_SERVER_ERROR));
    }
}

  

 async show(req: Request, res: Response) {
   try {
     const detteData = await prisma.dette.findMany({
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

     res.status(StatusCodes.OK)
       .send(RestResponse.response(detteData, StatusCodes.OK));
   } catch (error) {
     console.error('Error fetching Dettes:', error);
     res.status(StatusCodes.INTERNAL_SERVER_ERROR)
       .send(RestResponse.response("Erreur lors de la récupération des données", StatusCodes.INTERNAL_SERVER_ERROR));
   }
 }

 async edit(req: Request, res: Response) {
  try {
    const { id } = req.params; // Récupération de l'ID à partir des paramètres d'URL

    // Vérification si l'ID est bien présent
    if (!id) {
      return res.status(StatusCodes.BAD_REQUEST)
        .send(RestResponse.response("ID manquant dans les paramètres de la requête.", StatusCodes.BAD_REQUEST));
    }

    // Conversion de l'ID en entier
    const parsedId = parseInt(id, 10);

    // Vérification si la conversion en entier a réussi
    if (isNaN(parsedId)) {
      return res.status(StatusCodes.BAD_REQUEST)
        .send(RestResponse.response("L'ID fourni n'est pas valide.", StatusCodes.BAD_REQUEST));
    }

    // Requête à la base de données avec Prisma pour récupérer la dette
    const detteData = await prisma.dette.findFirstOrThrow({
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
    res.status(StatusCodes.OK)
      .send(RestResponse.response(detteData, StatusCodes.OK));
  } catch (error: any) {
    console.error('Error fetching Dette:', error);

    if (error.name === "NotFoundError") {
      // Gestion de l'erreur NotFoundError pour findFirstOrThrow
      return res.status(StatusCodes.NOT_FOUND)
        .send(RestResponse.response("La dette avec cet ID n'existe pas.", StatusCodes.NOT_FOUND));
    }

    // Réponse générique en cas d'erreur
    res.status(StatusCodes.INTERNAL_SERVER_ERROR)
      .send(RestResponse.response("Erreur lors de la récupération des données.", StatusCodes.INTERNAL_SERVER_ERROR));
  }
}


 async editByDate(req: Request, res: Response) {
   try {

     const detteData = await prisma.dette.findMany({
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
       return res.status(StatusCodes.NOT_FOUND)
         .send(RestResponse.response("Aucune dette trouvée pour cette date", StatusCodes.NOT_FOUND));
     }

     res.status(StatusCodes.OK)
       .send(RestResponse.response(detteData, StatusCodes.OK));
   } catch (error) {
     console.error('Error fetching Dette by Date:', error);
     res.status(StatusCodes.NOT_FOUND)
       .send(RestResponse.response("Erreur lors de la récupération des données", StatusCodes.NOT_FOUND));
   }
 }


 async filterDettesByStatut(req: Request, res: Response) {
  try {
    const { statut } = req.query; // Récupération du statut depuis la requête ('solde' ou 'non_solde')

    // Validation du statut
    if (!statut || (statut !== 'solde' && statut !== 'non_solde')) {
      return res.status(StatusCodes.BAD_REQUEST)
        .send(RestResponse.response(null, StatusCodes.BAD_REQUEST, "Statut non valide. Utilisez 'solde' ou 'non_solde'."));
    }

    let dettes;

    console.log(`Filtrage par statut: ${statut}`);

    // Filtrage des dettes en fonction du statut
    if (statut === 'solde') {
      // Filtrer les dettes soldées (montantDue égal à 0)
      dettes = await prisma.dette.findMany({
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
    } else if (statut === 'non_solde') {
      // Filtrer les dettes non soldées (montantDue supérieur à 0)
      dettes = await prisma.dette.findMany({
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
      return res.status(StatusCodes.NOT_FOUND)
        .send(RestResponse.response( "Aucune dette trouvée pour ce statut.", StatusCodes.NOT_FOUND));
    }

    // Réponse réussie avec les dettes filtrées
    res.status(StatusCodes.OK)
      .send(RestResponse.response(dettes, StatusCodes.OK, "Dettes filtrées avec succès"));
  } catch (error: any) {
    console.error('Erreur lors du filtrage des dettes:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR)
      .send(RestResponse.response(error.message, StatusCodes.INTERNAL_SERVER_ERROR, "Erreur lors du filtrage des dettes"));
  }
}



}
