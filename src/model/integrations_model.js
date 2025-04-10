require("dotenv").config();
const uuid = require("uuid").v4;

const integrationsList = [
  {
    id: "1",
    name: "ixc-Itabaiana",
    host: "https://ixc-sergipe.vianet.online",
    secret:
      "6:b40ed1fbd0002cf4c9d04de2112f8761062517f55bc5559c693272d19621d6c5",
    type: "ixc.standard.central.vd_contrato_produto",
  },
];

module.exports = {

  getAllIntegrations: () => integrationsList,

  getIntegrationById: (id) =>
    integrationsList.find((integration) => integration.id == id),

  getIntegrationByName: (name) =>
    integrationsList.find((integration) => integration.name == name),

  getIntegrationBySecret: (secret) =>
    integrationsList.find((integration) => integration.secret == secret),

  createIntegration: (name, host, sercret, type) => {
    const id = uuid();
    const newIntegration = {
      id,
      name,
      host,
      sercret,
      type,
    };
    integrationsList.push(newIntegration);
    return newIntegration;
  },
};
