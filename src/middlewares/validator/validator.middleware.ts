import { RequestHandler } from "express";
import { StatusCodes } from "http-status-codes";
import { z, ZodError } from "zod";
import { articlePostSchema } from "./schemas/article.post.schema";
import RestResponse from "../../core/response";
import { ReponseValidator } from "./reponse.validator";
import { clientPostSchema } from "./schemas/client.post.schema";
import { dettePostSchema } from "./schemas/dette.poste.schema";
import { paiementPostSchema } from "./schemas/paiement.schema";
import { userPostSchema } from "./schemas/user.post.schema";

export const supportedMethods = ["post", "put", "delete","patch","get"];

const schemas= {
    "post/api/v1/articles": articlePostSchema,
    "post/api/v1/clients": clientPostSchema,
    "post/api/v1/dettes": dettePostSchema,
    "post/api/v1/paiements": paiementPostSchema,
    "post/api/v1/users": userPostSchema,
} as { [key: string]: z.ZodObject<any,any> }

export const validatorSchema = (): RequestHandler => {
    return async (req, res, next) => {
        const method = req.method.toLowerCase();
        if (!supportedMethods.includes(method)) {
            return next();
        }

        const schemaKey = `${method}${req.originalUrl}`;

        if (!schemas[schemaKey]) {
            return next();
        }

        try {
            await schemas[schemaKey].parseAsync(req.body);
            return next();
        } catch (error) {
            if (error instanceof ZodError) {
                const reponseValidator: ReponseValidator = {
                    data: error.errors.map((issue: any) => ({
                        message: `${issue.path.join(".")} is ${issue.message}`
                    })),
                    status: false,
                };
                return res.status(StatusCodes.UNPROCESSABLE_ENTITY).send(RestResponse.response(reponseValidator, StatusCodes.UNPROCESSABLE_ENTITY, "erreur de validation"));
            }
        }
    };
}
export default validatorSchema;
