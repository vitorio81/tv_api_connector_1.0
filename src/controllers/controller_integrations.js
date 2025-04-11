const integrations_model = require("../model/integrations_model");

module.exports = {
  register: (req, res) => {
    const { name, host, type, secret } = req.body;

    if (
      typeof name !== "string" ||
      typeof host !== "string" ||
      typeof type !== "string" ||
      typeof secret !== "string"
    ) {
      return res
        .status(400)
        .json({ message: "Todos os campos são obrigatórios" });
    }
    const existingIntegrationName =
      integrations_model.getIntegrationByName(name);
    const existingIntegrationSecret =
      integrations_model.getIntegrationBySecret(secret);
    if (existingIntegrationName || existingIntegrationSecret) {
      return res
        .status(400)
        .json({ message: "Já Existe um usuário cadastrado " });
    } else {
      const newIntegration = integrations_model.createIntegration(
        name,
        host,
        type,
        secret
      );
      return res.status(200).json(newIntegration);
    }
  },

  index: (req, res) => {
    const integrations = integrations_model.getAllIntegrations();
    return res.status(200).json(integrations);
  },

  delete: (req, res) => {
    const { id } = req.params;
    const deleteIntegration = integrations_model.deleteIntegration(id);
    return res.status(200).json(deleteIntegration);
  },
};
