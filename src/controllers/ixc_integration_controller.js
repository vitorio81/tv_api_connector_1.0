// controller.js
const axios = require("axios");
const integrations_model = require("../model/integrations_model");
const request_model = require("../model/request_model");

const tryIntegration = async (req, res) => {
  const {
    host: originalHost,
    type,
    secret: originalSecret,
    username,
    password,
  } = req.body;

  let statusRequest = false;

  const integrationList = await integrations_model.getAllIntegrations();

  for (let integration of integrationList) {
    try {
      const response = await axios.post(`${integration.host}`, {
        host: integration.host,
        type,
        secret: integration.secret,
        username,
        password,
      });

      await request_model.createRequest({
        host: integration.host,
        status: "sucesso",
        validate: response.data.validate,
      });

      statusRequest = true;

      const integrationSecret = await integrations_model.getIntegrationBySecret(
        integration.secret
      );

      if (!integrationSecret) {
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
    } catch (error) {
      await request_model.createRequest({
        host: integration.host,
        status: "erro", // Corrigido: se caiu no catch, é um erro
        validate: false, // Não foi validado com sucesso
      });

      console.error(error.response?.data || error.message);
      continue;
    }
  }

  if (!statusRequest) {
    return res.status(500).json({
      message: "Não foi possível integrar com nenhuma API.",
    });
  } else {
    return res.status(200).json({
      host: originalHost,
      secret: originalSecret,
      type,
      username,
      password,
      validate: false,
    });
  }
};

module.exports = { tryIntegration };
