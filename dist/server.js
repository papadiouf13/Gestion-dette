"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config;
const port = (_a = process.env.PORT) !== null && _a !== void 0 ? _a : 5000;
app_1.default.server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
