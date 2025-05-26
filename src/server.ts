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
    origin: ["https://int-vianet.owlcore.com.br"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use((req, res, next) => {
  const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
  const userAgent = req.headers["user-agent"];
  const origin = req.headers["origin"] || req.headers["referer"];

  console.log("======= NOVA REQUISIÇÃO =======");
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  console.log("IP:", ip);
  console.log("User-Agent:", userAgent);
  console.log("Origin/Referer:", origin);
  console.log("Headers:", req.headers);
  console.log("================================");

  next();
});

app.use(apiAuth);
app.use("/administration", verifyAdminToken, adminRouters);
app.use("/admin", adminAuthRoute);

app.use(errorMiddleware);

const PORT = process.env.PORT || 3000;
const HOST = getLocalIP();
app.listen(PORT, () =>
  console.log(
    `Servidor iniciado no endereço https://${HOST}:3000\nPorta ${PORT}`
  )
);
