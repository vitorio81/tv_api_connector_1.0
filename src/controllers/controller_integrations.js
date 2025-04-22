const { query } = require("../config_database/pool");
const integrations_model = require("../model/integrations_model");

module.exports = {
  register: async (req, res, next) => {
    try {
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
       const existingIntegrationName = await
         integrations_model.getIntegrationByName(name);
       const existingIntegrationSecret = await
         integrations_model.getIntegrationBySecret(secret);
       if (!existingIntegrationName || !existingIntegrationSecret) {
         const newIntegration = await integrations_model.createIntegration(
           name,
           host,
           secret,
           type
         );
         return res.status(200).json(newIntegration);
       } else {
         return res.status(400).json({ error: "Integração já existente!" });
       }
    } catch (error) {
      next(error);
    }
   
  },

  index: async(req, res, next) => {
    try {
      const integrations = await integrations_model.getAllIntegrations();
      res.json({data: integrations});
    } catch (error) {
      next(error); 
    }
  },

  show: async(req, res, next) => {
    try {
      const { id } = req.params;
      const integration = await integrations_model.getIntegrationById(id);
      if(!integration) {
        return res.status(404).json({ message: "Integração não encontrada" });
      }
      res.json({ data: integration });

    } catch (error) {
      next(error);
    }
  },

  delete: async (req, res, next) => {
    try {
      const { id } = req.params;
      const deleteIntegration = await integrations_model.getIntegrationById(id)
       if (!deleteIntegration) {
         return res.status(404).json({ error: "Integração não encontrada!" });
       }
      await query(`DELETE FROM integrations WHERE id = $1`, [id]);
      return res.json({
        data: `Integração deletada: ${deleteIntegration.name || "sem nome"}`,
      });
    } catch (error) {
      next(error); 
    }
  },
};
