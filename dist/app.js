"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const article_route_1 = __importDefault(require("./routes/article.route"));
const client_route_1 = __importDefault(require("./routes/client.route"));
const dette_route_1 = __importDefault(require("./routes/dette.route"));
const auth_route_1 = __importDefault(require("./routes/auth.route"));
const paiement_route_1 = __importDefault(require("./routes/paiement.route"));
const prisma_config_1 = __importDefault(require("./config/prisma.config"));
const user_route_1 = __importDefault(require("./routes/user.route"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swagger_config_1 = require("./config/swagger.config");
class App {
    constructor() {
        this.server = (0, express_1.default)();
        this.middleware();
        this.routes();
        this.prisma = prisma_config_1.default;
    }
    middleware() {
        this.server.use((0, cors_1.default)({
            origin: 'http://localhost:5173',
            credentials: true,
        }));
        this.server.use(express_1.default.json());
        this.server.use("/docs", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_config_1.swaggerSpec));
    }
    routes() {
        this.server.use("/api/v1/articles", article_route_1.default);
        this.server.use("/api/v1/clients", client_route_1.default);
        this.server.use("/api/v1/dettes", dette_route_1.default);
        this.server.use("/api/v1/paiements", paiement_route_1.default);
        this.server.use('/api/v1/auth', auth_route_1.default);
        this.server.use('/api/v1/users', user_route_1.default);
    }
}
const app = new App();
exports.default = app;
