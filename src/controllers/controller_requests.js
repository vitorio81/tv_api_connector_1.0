const request_model = require("../model/request_model");

 module.exports = {
   index: async (req, res, next) => {
    try {
      const request = await request_model.getAllRequests();
      return res.json({ data: request });
    } catch (error) {
      next(error)
    }
   },
 };
