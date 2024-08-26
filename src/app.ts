import express from 'express';
import cors from 'cors';
import routerArticle from './routes/article.route';
import routerClient from './routes/client.route';
import routerDette from './routes/dette.route';
import routerAuth from './routes/auth.route';
import routerPaiement from './routes/paiement.route'; 
import PrismaClient from './config/prisma.config';
import routerUser from './routes/user.route';
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from './config/swagger.config';

class App {
    public server;
    public prisma;

    constructor() {
        this.server = express();
        this.middleware();
        this.routes();
        this.prisma = PrismaClient;
    }

    middleware() {
        this.server.use(cors({
            origin: 'http://localhost:5173', 
            credentials: true,
        }));
        this.server.use(express.json());
        this.server.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
    }

    routes() {
        this.server.use("/api/v1/articles", routerArticle);
        this.server.use("/api/v1/clients", routerClient);
        this.server.use("/api/v1/dettes", routerDette);
        this.server.use("/api/v1/paiements", routerPaiement); 
        this.server.use('/api/v1/auth', routerAuth);
        this.server.use('/api/v1/users', routerUser);
    }
}

const app = new App();
export default app;
