"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authUsers_route_1 = __importDefault(require("./routes/authUsers.route"));
const adminRoutes_route_1 = __importDefault(require("./routes/adminRoutes.route"));
const error_middleware_1 = require("./middlewares/error-middleware");
const authAdmin_route_1 = __importDefault(require("./routes/authAdmin.route"));
const verifyAdminToken_1 = require("./middlewares/verifyAdminToken");
const network_1 = require("./utils/network");
const app = (0, express_1.default)();
app.use(express_1.default.urlencoded({ extended: true }));
app.use(express_1.default.json());
const cors = require("cors");
app.use(cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
}));
app.use(authUsers_route_1.default);
app.use("/administration", verifyAdminToken_1.verifyAdminToken, adminRoutes_route_1.default);
app.use("/admin", authAdmin_route_1.default);
app.use(error_middleware_1.errorMiddleware);
const PORT = process.env.PORT || 3000;
const HOST = (0, network_1.getLocalIP)();
app.listen(PORT, () => console.log(`Servidor iniciado no endereço https://${HOST}:3000\nPorta ${PORT}`));
