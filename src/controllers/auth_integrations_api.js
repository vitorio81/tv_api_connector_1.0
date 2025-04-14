const integrationsModel = require("../model/integrations_model");

module.exports = {
    login: async (req, res, next) => {
        try {
             const { secret } = req.body;
             const integrationSecret =
               await integrationsModel.getIntegrationBySecret(secret);
             if (!integrationSecret) {
               return res
                 .status(404)
                 .json({ message: "Não esxite nenhuma integração Cadastrada" });
             } else {
               return res
                 .status(200)
                 .json({ message: "Integração autorizada!" });
             }
        } catch (error) {
            next(error);
        
        }
    }
}