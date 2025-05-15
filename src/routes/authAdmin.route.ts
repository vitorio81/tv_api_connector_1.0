import express from "express";
import { authAdmin } from "../controllers/AuthAdmin";
const adminAuthRoute = express.Router();

adminAuthRoute.post("/register", authAdmin.register);
adminAuthRoute.post("/login", authAdmin.login);

export default adminAuthRoute;
