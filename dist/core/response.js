"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class RestResponse {
    static response(data, HttpCode, message = "effectué avec succès") {
        return {
            status: HttpCode,
            data,
            message,
        };
    }
}
exports.default = RestResponse;
