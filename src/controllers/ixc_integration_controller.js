const axios = require("axios");
const integrations_model = require("../model/integrations_model");
const request_model = require("../model/request_model");

const tryIntegration = async (req, res, next) => {
  const {
    host: originalHost,
    type,
    secret: originalSecret,
    username,
    password,
  } = req.body;

  try {
    const integrationList = await integrations_model.getAllIntegrations();

    for (let integration of integrationList) {
      try {
        const response = await axios.post(`${integration.host}`, {
          host: integration.host,
          type: integration.type,
          secret: integration.secret,
          username,
          password,
        });

        await request_model.createRequest({
          host: integration.host,
          status: "sucesso",
          validate: response.data.validate,
        });

        const integrationSecret =
          await integrations_model.getIntegrationBySecret(integration.secret);

        if (!integrationSecret) {
          return res
            .status(401)
            .json({ message: "Token da integração não está autorizado." });
        }

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
        // se validou === false, continua o loop
      } catch (error) {
        await request_model.createRequest({
          host: integration.host,
          status: "erro",
          validate: false,
        });

        console.error(
          `Erro ao tentar integração com ${integration.host}:`,
          error.response?.data || error.message
        );
        // continua o loop
      }
    }

    // Se chegou aqui, nenhuma validação passou
    return res.status(200).json({
      host: originalHost,
      secret: originalSecret,
      type,
      username,
      password,
      validate: false,
      message: "Não foi possível integrar com nenhuma API.",
    });
  } catch (error) {
    // qualquer erro inesperado no bloco principal vai cair aqui
    next(error); // chama seu error-middleware.js
  }
};

module.exports = { tryIntegration };