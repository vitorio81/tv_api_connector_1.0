const express = require('express')
const authApi = require('../controllers/auth_user_api')
const authIntegrationsApi = require('../controllers/auth_integrations_api')
const apiAuth = express.Router();

apiAuth.post("/login/user", authApi.login);
apiAuth.post("/login/integretion", authIntegrationsApi.login);

module.exports = apiAuth;