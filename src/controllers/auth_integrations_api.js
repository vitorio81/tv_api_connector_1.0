const integrationsModel = require("../model/integrations_model");

module.exports = {

    register: (req, res) => {
        const {name, host, type, secret} = req.body

        if(
            typeof name !== "string"||
            typeof host !== "string"||
            typeof type !== "string"||
            typeof secret !== "string"
        ) {
            return res.status(400).json({message: 'Todos os campos são obrigatórios'})
        } 
        const existingIntegrationName = integrationsModel.getIntegrationByName(name)
        const existingIntegrationSecret = integrationsModel.getIntegrationBySecret(secret)
        if(existingIntegrationName || existingIntegrationSecret) {
            return res.status(400).json({message: 'Já Existe um usuário cadastrado '})
        } else {
            const newIntegration = integrationsModel.createIntegration(name, host, type, secret)
            return res.status(200).json(newIntegration)
        }
    },

    login: (req, res) => {
        const {secret} = req.body
        const integrationSecret = integrationsModel.getIntegrationBySecret(secret)
        if(!integrationSecret) {
            return res.status(404).json({message: 'Não esxite nenhuma integração Cadastrada'})
        } else {
            return res
              .status(200)
              .json({ message: "Integração autorizada!" });
        }
    }
}