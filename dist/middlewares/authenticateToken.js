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
exports.roleautorisation = exports.authentification = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const http_status_codes_1 = require("http-status-codes");
const response_1 = __importDefault(require("../core/response"));
const authentification = () => {
    const { JSECRET_ACCESS_TOKEN } = process.env;
    return (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const token = (_a = req.header('Authorization')) === null || _a === void 0 ? void 0 : _a.replace('Bearer ', '');
        if (!token) {
            return res.status(http_status_codes_1.StatusCodes.UNAUTHORIZED).send(response_1.default.response(null, http_status_codes_1.StatusCodes.UNAUTHORIZED.valueOf(), 'No token provided'));
        }
        jsonwebtoken_1.default.verify(token, `${JSECRET_ACCESS_TOKEN}`, (err, user) => {
            if (err) {
                return res.status(http_status_codes_1.StatusCodes.UNAUTHORIZED).send(response_1.default.response(err, http_status_codes_1.StatusCodes.UNAUTHORIZED.valueOf(), 'Invalid token'));
            }
            req.body.user = user;
            next();
        });
    });
};
exports.authentification = authentification;
const roleautorisation = (roles) => {
    return (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const { role } = req.body.user;
        if (!roles.includes(role)) {
            return res.status(http_status_codes_1.StatusCodes.UNAUTHORIZED).send(response_1.default.response(null, http_status_codes_1.StatusCodes.UNAUTHORIZED.valueOf(), 'Pas d\'autorisation'));
        }
        next();
    });
};
exports.roleautorisation = roleautorisation;
