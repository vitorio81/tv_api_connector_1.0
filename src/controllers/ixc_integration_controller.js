// controller.js
const axios = require("axios");
const integrationsList = require("./req_api_model");

const tryIntegration = async (req, res) => {
  const {host: orignalHost, type, secret: originalSecret, username, password } = req.body;

  for (let integration of integrationsList) {
    try {
      const response = await axios.post(`${integration.host}`, {
        host: integration.host,
        type,
        secret: integration.token,
        username,
        password,
      })
      const integrationSecret = integrationsModel.getIntegrationBySecret(
        integration.token
      ) 
      if(!integrationSecret) {
        return res
          .status(401)
          .json({ message: "Token da integração não está autorizado." });
      } else {
        if (response.data.validate === true) {
           return res.status(200).json({
             host: originalHost,
             secret: originalSecret,
             type,
             username,
             password,
             validate: true,
           });
        }
      }
    } catch (err) {
      console.log(`Erro com ${integration.host}:`, err.message);
      continue;
    }
  }

  return res.status(200).json({
    host: orignalHost,
    secret: originalSecret,
    type,
    username,
    password,
    validate: false,
  });
};

module.exports = { tryIntegration };
