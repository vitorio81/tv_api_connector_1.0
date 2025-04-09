const express = require('express')
const authApi = require('../controllers/auth_user_api')
const authIntegrationsApi = require('../controllers/auth_integrations_api')
const router =express.Router()

router.post('/auth/register/user', authApi.register)
router.post('/auth/login/user', authApi.login)
router.post('/auth/register/integretion', authIntegrationsApi.register)
router.post('/auth/login/integretion', authIntegrationsApi.login
)

module.exports = router