"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const authRoutes_1 = __importDefault(require("./auth/authRoutes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.use('/auth', authRoutes_1.default);
app.get('/', (req, res) => {
    res.send('Backend is running...');
});
const PORT = process.env.PORT || '4000';
app.listen(Number(PORT), () => {
    console.log(`Backend running on port ${PORT}`);
});
