const express = require('express');
const auth_admin = require('../controllers/auth_admin');
const adminAuthRoute = express.Router();

adminAuthRoute.post("/register", auth_admin.register);
adminAuthRoute.post("/login", auth_admin.login);


module.exports = adminAuthRoute;
