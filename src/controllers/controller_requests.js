const request_model = require("../model/request_model");

 module.exports = {
   index: (req, res) => {
     const request = request_model.getAllRequests();
     return res.json(request);
   },
 };
