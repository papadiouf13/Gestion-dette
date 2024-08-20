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
exports.validatorSchema = exports.supportedMethods = void 0;
const http_status_codes_1 = require("http-status-codes");
const zod_1 = require("zod");
const article_post_schema_1 = require("./schemas/article.post.schema");
const response_1 = __importDefault(require("../../core/response"));
const client_post_schema_1 = require("./schemas/client.post.schema");
const dette_poste_schema_1 = require("./schemas/dette.poste.schema");
const paiement_schema_1 = require("./schemas/paiement.schema");
const user_post_schema_1 = require("./schemas/user.post.schema");
exports.supportedMethods = ["post", "put", "delete", "patch", "get"];
const schemas = {
    "post/api/v1/articles": article_post_schema_1.articlePostSchema,
    "post/api/v1/clients": client_post_schema_1.clientPostSchema,
    "post/api/v1/dettes": dette_poste_schema_1.dettePostSchema,
    "post/api/v1/paiements": paiement_schema_1.paiementPostSchema,
    "post/api/v1/users": user_post_schema_1.userPostSchema,
};
const validatorSchema = () => {
    return (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const method = req.method.toLowerCase();
        if (!exports.supportedMethods.includes(method)) {
            return next();
        }
        const schemaKey = `${method}${req.originalUrl}`;
        if (!schemas[schemaKey]) {
            return next();
        }
        try {
            yield schemas[schemaKey].parseAsync(req.body);
            return next();
        }
        catch (error) {
            if (error instanceof zod_1.ZodError) {
                const reponseValidator = {
                    data: error.errors.map((issue) => ({
                        message: `${issue.path.join(".")} is ${issue.message}`
                    })),
                    status: false,
                };
                return res.status(http_status_codes_1.StatusCodes.UNPROCESSABLE_ENTITY).send(response_1.default.response(reponseValidator, http_status_codes_1.StatusCodes.UNPROCESSABLE_ENTITY, "erreur de validation"));
            }
        }
    });
};
exports.validatorSchema = validatorSchema;
exports.default = exports.validatorSchema;
