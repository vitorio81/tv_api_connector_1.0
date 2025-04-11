require("dotenv").config();
const uuid = require("uuid").v4;

let integrationsList = [
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
    integrationsList.find((integration) => integration.id === id),

  getIntegrationByName: (name) =>
    integrationsList.find((integration) => integration.name === name),

  getIntegrationBySecret: (secret) =>
    integrationsList.find((integration) => integration.secret === secret),

  createIntegration: (name, host, sercret, type) => {
    const id = uuid();
    const currentDate = new Date().toISOString().split("T")[0]; 
    const newIntegration = {
      id,
      name,
      host,
      sercret,
      type,
      currentDate,
    };
    integrationsList.push(newIntegration);
    return newIntegration;
  },

  deleteIntegration: (id) => {
    const InteIndex = integrationsList.findIndex(integration => integration.id === id)
    if(InteIndex === -1)throw new HttpError(404, "Integração não encontra no sistema!")
    const deleteIntegration = integrationsList[InteIndex]
    integrationsList = integrationsList.filter(integration => integration.id !== id)
    return deleteIntegration
  }
};
