const express = require("express");
const controller_integrations = require("../controllers/controller_integrations");
const controller_user = require("../controllers/controller_user");
const controller_requests = require("../controllers/controller_requests");
const verifyAdminToken = require("../middlewares/verify_admin_token");
const adminRouters = express.Router();

adminRouters.post(
  "/register/integretion",
  verifyAdminToken,
  controller_integrations.register
);

adminRouters.post(
    "/register/user", 
    verifyAdminToken, 
    controller_user.register);

adminRouters.get(
  "/integrations",
  verifyAdminToken,
  controller_integrations.index
);

adminRouters.get(
    "/users", 
    verifyAdminToken, 
    controller_user.index);

adminRouters.delete(
  "/integrations/:id",
  verifyAdminToken,
  controller_integrations.delete
);

adminRouters.delete(
    "/users/:id", 
    verifyAdminToken, 
    controller_user.delete);

adminRouters.get(
    "/requests", 
    verifyAdminToken,
    controller_requests.index);

module.exports = adminRouters;
