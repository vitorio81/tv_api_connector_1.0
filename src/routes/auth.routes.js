const express = require('express')
const authApi = require('../controllers/auth_user_api')
const authIntegrationsApi = require('../controllers/auth_integrations_api')
const router =express.Router()

router.post('/login/user', authApi.login)
router.post('/login/integretion', authIntegrationsApi.login)

module.exports = router