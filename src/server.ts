import dotenv from "dotenv";
dotenv.config({ path: "/srv/tv_api_connector_1.0/.env" });
import express from "express";
import apiAuth from "./routes/authUsers.route";
import adminRouters from "./routes/adminRoutes.route";
import { errorMiddleware } from "./middlewares/error-middleware";
import adminAuthRoute from "./routes/authAdmin.route";
import { verifyAdminToken } from "./middlewares/verifyAdminToken";
import { getLocalIP } from "./utils/network";

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const cors = require("cors");
app.use(
  cors({
    origin:"http://131.72.68.243:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use("/auth", apiAuth);
app.use("/administration", verifyAdminToken, adminRouters);
app.use("/admin", adminAuthRoute);

app.use(errorMiddleware);

const PORT = process.env.PORT || 3000;
const HOST = getLocalIP();
app.listen(PORT, () =>
  console.log(
    `Servidor iniciado no endereço http://${HOST}:3000\nPorta ${PORT}`
  )
);
