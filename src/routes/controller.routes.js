const express = require("express");
const controller_integrations = require("../controllers/controller_integrations");
const controller_user = require("../controllers/controller_user");
const verifyAdminToken = require("../middlewares/verify_admin_token");
const controller_requests = require("../controllers/controller_requests");
const controllerRoute = express.Router();

controllerRoute.post(
  "/register/integretion",
  verifyAdminToken,
  controller_integrations.register
);
controllerRoute.post(
  "/register/user",
  verifyAdminToken,
  controller_user.register
);
-
controllerRoute.get(
  "/integrations",
  verifyAdminToken,
  controller_integrations.index
);
controllerRoute.get("/users", verifyAdminToken, controller_user.index);

controllerRoute.delete(
  "/integrations/:id",
  verifyAdminToken,
  controller_integrations.delete
);
controllerRoute.delete("/users/:id", verifyAdminToken, controller_user.delete);

controllerRoute.get('/requests', verifyAdminToken, controller_requests.index );

module.exports = controllerRoute;
