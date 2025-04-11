const express = require('express');
const admin_model = require('../model/admin_model');
const auth_admin = require('../controllers/auth_admin');
const adminRoute = express.Router()

adminRoute.post('/register', auth_admin.register);
adminRoute.post('/login', auth_admin.login);


module.exports = adminRoute;
