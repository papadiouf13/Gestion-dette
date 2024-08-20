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
exports.encrypt = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const { JSECRET_ACCESS_TOKEN, JSECRET_TIME_TO_EXPIRE } = process.env;
class encrypt {
    static encryptpass(password) {
        return __awaiter(this, void 0, void 0, function* () {
            return bcrypt_1.default.hashSync(password, 12);
        });
    }
    static comparepassword(hashPassword, password) {
        return __awaiter(this, void 0, void 0, function* () {
            return bcrypt_1.default.compare(password, hashPassword);
        });
    }
    static generateToken(payload, expiresIn = JSECRET_TIME_TO_EXPIRE) {
        return jsonwebtoken_1.default.sign(payload, `${JSECRET_ACCESS_TOKEN}`, { expiresIn: expiresIn });
    }
}
exports.encrypt = encrypt;
