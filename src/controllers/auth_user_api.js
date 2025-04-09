const usersModel = require("../model/users _api_model");


module.exports = {

    register: (req, res ) => {
        const { name, contract} = req.body;

        if (
          typeof name !== "string" ||
          typeof contract !== "string"
        ) {
          return res
            .status(400)
            .json({ message: "Todos os campos são obrigatórios" });
        }

        const existingUser = usersModel.getUserByContract(contract)
        if(existingUser) {
            return res.status(400).json({massage: 'Contrato já cadastrado'})
        } else {
            const newUser = usersModel.createUser(name, contract)
            return res.status(200).json(newUser);
        }

    },

    login: (req, res) => {
       const {sercret} = req.body
       const userSecret = usersModel.getUserBySecret(sercret);
       if(!userSecret) {
        return res.status(404).json({error: 'Token inválido!'})
       } else {
        return res.status(200).json({message: 'Usuário autorizado!'})
       }
    }
}