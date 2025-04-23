const express = require('express')
const authIntegrationsApi = require('../controllers/auth_integrations_api');
const auth_user_api = require('../controllers/auth_user_api');
const apiAuth = express.Router();

apiAuth.post("/login/user", auth_user_api.login);
apiAuth.post("/login/integretion", authIntegrationsApi.login);

module.exports = apiAuth;