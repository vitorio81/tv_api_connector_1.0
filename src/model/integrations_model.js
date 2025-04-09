require("dotenv").config();
const uuid = require("uuid").v4;


const integrations = require('./req_api_model')

module.exports = {
  getAllIntegrations: () => integrations,

  getIntegrationById: (id) =>
    integrations.find((integration) => integration.id == id),

  getIntegrationByName: (name) =>
    integrations.find((integration) => integration.name == name),

  getIntegrationBySecret: (secret) =>
    integrations.find((integration) => integration.secret == secret),

  createIntegration: (name, host, sercret, type) => {
    const id = uuid();
    const newIntegration = {
      id,
      name,
      host,
      sercret,
      type,
    };
    integrations.push(newIntegration);
    return newIntegration;
  },
};
