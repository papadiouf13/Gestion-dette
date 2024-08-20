import Controller from "../core/impl/controller";
import { Request, Response } from "express";
import prisma from "../config/prisma.config";
import RestResponse from "../core/response";
import { StatusCodes } from "http-status-codes";
import { encrypt } from "../helpers/encrypt";

export class ClientController extends Controller{
   async store(req: Request, res: Response) {
      try {
          const { nom, prenom, telephone, photo, email, password } = req.body;
  
          // Cryptage du mot de passe si un mot de passe est fourni
          const hashPassword = password ? await encrypt.encryptpass(password) : undefined;
  
          // Vérification si un utilisateur avec le même email existe déjà
          if (email && password) {
              const existingUser = await prisma.user.findUnique({
                  where: { email },
              });

          }
  
          // Création du client avec un utilisateur optionnel
          const newData = await prisma.client.create({
              data: {
                  nom,
                  prenom,
                  telephone,
                  photo,
                  user: email && password ? {
                      create: {
                          email: email, 
                          password: hashPassword!,
                         
                      }
                  } : undefined // Ne pas créer un utilisateur si email et password ne sont pas fournis
              },
              include: {
                  user: true // Inclure les informations de l'utilisateur dans la réponse
              }
          });
  
          res.status(StatusCodes.CREATED)
              .send(RestResponse.response(newData, StatusCodes.CREATED));
      } catch (error) {
          console.log("Error creating client:", error); // Affichez l'erreur pour plus de détails
          res.status(StatusCodes.INTERNAL_SERVER_ERROR)
              .send(RestResponse.response(error, StatusCodes.INTERNAL_SERVER_ERROR, 'Erreur lors de la création du client.'));
      }
  }
  
  
  
    

async show(req: Request, res: Response) {
   try {
       const newData = await prisma.client.findMany({
          select:{
           id: true,
           nom: true,
           prenom: true,
           telephone: true,
           user: true,
          }
       })
       res.status(StatusCodes.OK)
       .send(RestResponse.response(newData,StatusCodes.OK));
       } catch (error) {
          res.status(StatusCodes.NOT_FOUND)
          .send(RestResponse.response(error,StatusCodes.NOT_FOUND)); 
       }
}

async edit(req: Request, res: Response) {
   try {
       const newData = await prisma.client.findFirstOrThrow({
           where: { 
               id: parseInt(req.params.id) 
           },
           select:{
            id: true,
            nom: true,
            prenom: true,
            telephone: true,
              } 
       })
       res.status(StatusCodes.OK)
       .send(RestResponse.response(newData,StatusCodes.OK));
       } catch (error) {
          res.status(StatusCodes.NOT_FOUND)
          .send(RestResponse.response(error,StatusCodes.NOT_FOUND)); 
       }
}

async editByTelephone(req: Request, res: Response) {  
   try {
       const newData = await prisma.client.findFirstOrThrow({
           where: { 
               telephone: req.body.telephone
           },
           select:{
            id: true,
            nom: true,
            prenom: true,
            telephone: true,
              } 
       })
       res.status(StatusCodes.OK)
       .send(RestResponse.response(newData,StatusCodes.OK));
       } catch (error) {
          res.status(StatusCodes.NOT_FOUND)
          .send(RestResponse.response(error,StatusCodes.NOT_FOUND)); 
       }
}

 // Méthode pour obtenir les dettes d'un client par ID
 async getDettesClient(req: Request, res: Response) {
   try {
     const clientId = parseInt(req.params.id);
     
     // Vérifiez que l'ID client est un nombre valide
     if (isNaN(clientId)) {
       return res.status(StatusCodes.BAD_REQUEST)
         .send(RestResponse.response(null, StatusCodes.BAD_REQUEST, "ID client invalide."));
     }
 
     // Vérifiez que le client existe et récupérez ses dettes
     const clientWithDettes = await prisma.client.findUnique({
       where: { id: clientId },
       include: { dettes: true } // Inclure les dettes associées au client
     });
 
     if (!clientWithDettes) {
       return res.status(StatusCodes.NOT_FOUND)
         .send(RestResponse.response(null, StatusCodes.NOT_FOUND, "Client non trouvé."));
     }
 
     res.status(StatusCodes.OK)
       .send(RestResponse.response({ dettes: clientWithDettes.dettes }, StatusCodes.OK));
   } catch (error) {
     console.error("Error retrieving client debts:", error);
     res.status(StatusCodes.INTERNAL_SERVER_ERROR)
       .send(RestResponse.response(null, StatusCodes.INTERNAL_SERVER_ERROR, "Une erreur est survenue lors de la récupération des dettes du client."));
   }
 }
 
 

 // Méthode pour obtenir l'utilisateur d'un client par ID
 async getUserClient(req: Request, res: Response) {
   try {
     const clientId = parseInt(req.params.id);
     
     // Vérifiez que l'ID client est un nombre valide
     if (isNaN(clientId)) {
       return res.status(StatusCodes.BAD_REQUEST)
         .send(RestResponse.response(null, StatusCodes.BAD_REQUEST, "ID client invalide."));
     }
 
     // Récupérez le client avec les informations de l'utilisateur associées
     const clientWithUser = await prisma.client.findUnique({
       where: { id: clientId },
       include: { user: true } // Inclure les informations de l'utilisateur associé
     });
 
     if (!clientWithUser) {
       return res.status(StatusCodes.NOT_FOUND)
         .send(RestResponse.response(null, StatusCodes.NOT_FOUND, "Client non trouvé."));
     }
 
     res.status(StatusCodes.OK)
       .send(RestResponse.response({ user: clientWithUser.user }, StatusCodes.OK));
   } catch (error) {
     console.error("Error retrieving client user:", error);
     res.status(StatusCodes.INTERNAL_SERVER_ERROR)
       .send(RestResponse.response(null, StatusCodes.INTERNAL_SERVER_ERROR, "Une erreur est survenue lors de la récupération des informations utilisateur du client."));
   }
 }

 async getDetteClient(req: Request, res: Response) {
    try {
        // Vérifiez si req.user contient bien les informations attendues
        console.log("User from token:", req.body.user);
 
        const clientId = req.body.user?.clientId;
        
        if (!clientId) {
            return res.status(StatusCodes.BAD_REQUEST)
                .send(RestResponse.response(null, StatusCodes.BAD_REQUEST, "Client ID manquant."));
        }
 
        // Récupération des dettes du client
        const client = await prisma.client.findUnique({
            where: { id: clientId },
            include: { dettes: true },
        });
 
        if (!client || client.dettes.length === 0) {
            return res.status(StatusCodes.NOT_FOUND)
                .send(RestResponse.response(null, StatusCodes.NOT_FOUND, "Aucune dette trouvée pour ce client."));
        }
 
        res.status(StatusCodes.OK)
            .send(RestResponse.response(client.dettes, StatusCodes.OK));
    } catch (error) {
        console.error("Error getting client debts:", error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR)
            .send(RestResponse.response(error, StatusCodes.INTERNAL_SERVER_ERROR));
    }
 }
 

 async getDetteArticleClient(req: Request, res: Response) {
    try {
        // Récupération de l'ID de la dette depuis les paramètres de l'URL
        const { id } = req.params;

        // Récupération du client connecté à partir du token
        const clientId = req.body.user?.clientId;

        if (!clientId) {
            return res.status(StatusCodes.UNAUTHORIZED)
                .send(RestResponse.response(null, StatusCodes.UNAUTHORIZED, "Client non authentifié."));
        }

        // Rechercher la dette spécifique pour le client et inclure les articles à travers ArticleDette
        const dette = await prisma.dette.findFirst({
            where: {
                id: parseInt(id),
                clientId: clientId, // Associer la dette au bon client
            },
            include: {
                ArticleDette: { // Inclure les relations dans ArticleDette
                    include: {
                        article: true, // Inclure les détails des articles associés
                    },
                },
            },
        });

        // Vérifier si la dette ou les articles n'existent pas
        if (!dette || dette.ArticleDette.length === 0) {
            return res.status(StatusCodes.NOT_FOUND)
                .send(RestResponse.response(null, StatusCodes.NOT_FOUND, "Dette ou articles non trouvés pour ce client."));
        }

        // Récupération des articles liés à cette dette
        const articles = dette.ArticleDette.map(ad => ad.article);
        res.status(StatusCodes.OK)
            .send(RestResponse.response(articles, StatusCodes.OK, "Articles récupérés avec succès."));
    } catch (error) {
        console.error("Error getting debt articles:", error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR)
            .send(RestResponse.response(error, StatusCodes.INTERNAL_SERVER_ERROR));
    }
}

async getPaiementDetteClient(req: Request, res: Response) {
    try {
        // Récupération de l'ID de la dette depuis les paramètres de l'URL
        const { id } = req.params;

        // Vérification de ce qui est injecté dans req.user
        console.log("User from token:", req.body.user);

        // Récupération du client connecté à partir du token
        const clientId = req.body.user?.clientId;

        // Vérification que clientId est bien défini
        if (!clientId) {
            return res.status(StatusCodes.UNAUTHORIZED)
                .send(RestResponse.response(null, StatusCodes.UNAUTHORIZED, "Client non authentifié."));
        }

        // Vérifier si la dette appartient au client et récupérer les paiements associés
        const paiements = await prisma.paiement.findMany({
            where: {
                detteId: parseInt(id)
            },
        });

        // Vérifier si des paiements existent pour cette dette
        if (!paiements || paiements.length === 0) {
            return res.status(StatusCodes.NOT_FOUND)
                .send(RestResponse.response(null, StatusCodes.NOT_FOUND, "Aucun paiement trouvé pour cette dette ou client non associé."));
        }

        res.status(StatusCodes.OK)
            .send(RestResponse.response(paiements, StatusCodes.OK, "Paiements récupérés avec succès."));
    } catch (error) {
        console.error("Error getting debt payments:", error);

        // Gestion des erreurs plus explicite
        res.status(StatusCodes.INTERNAL_SERVER_ERROR)
            .send(RestResponse.response(null, StatusCodes.INTERNAL_SERVER_ERROR, "Erreur lors de la récupération des paiements."));
    }
}



        
}