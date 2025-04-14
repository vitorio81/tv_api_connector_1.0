const express = require("express");
const controller_integrations = require("../controllers/controller_integrations");
const controller_user = require("../controllers/controller_user");
const controller_requests = require("../controllers/controller_requests");
const controllerRoute = express.Router();

controllerRoute.post(
  "/register/integretion",
  controller_integrations.register
);
controllerRoute.post(
  "/register/user",
  controller_user.register
);
-
controllerRoute.get(
  "/integrations",
  controller_integrations.index
);
controllerRoute.get("/users", controller_user.index);

controllerRoute.delete(
  "/integrations/:id",
  controller_integrations.delete
);
controllerRoute.delete("/users/:id",  controller_user.delete);

controllerRoute.get('/requests',  controller_requests.index );

module.exports = controllerRoute;
