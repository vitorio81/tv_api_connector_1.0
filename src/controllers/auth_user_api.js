const usersModel = require("../model/users_api_model");
const { tryIntegration } = require("../controllers/ixc_integration_controller");


module.exports = {

    login: async (req, res, next) => {
        try {
            const { secret, username, password } = req.body;
            const userSecret = await usersModel.getUserBySecret(secret);
            if (!userSecret) {
              return res.status(404).json({ error: "Token inválido!" });
            }
            if (!username || !password) {
                return res
                  .status(404)
                  .json({ error: "Password ou username não encontrados!" });
            }
              await tryIntegration(req, res, next);
            
        } catch (error) {
            next(error)
        }
    }
}
