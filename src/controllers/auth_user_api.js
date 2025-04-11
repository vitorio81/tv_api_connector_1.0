const usersModel = require("../model/users _api_model");
const { tryIntegration } = require("./ixc_integration_controller");


module.exports = {

    login: async (req, res) => {
       const { secret, username, password } = req.body;
       const userSecret = usersModel.getUserBySecret(secret);
       if(!userSecret) {
        return res.status(404).json({error: 'Token inválido!'})
       }
        if(!username || !password) {
            return res.status(404).json({error: 'Password ou username não encontrados!'})
        }

        await tryIntegration(req, res);
    }
}