require("dotenv").config();
const uuid = require("uuid").v4;

let requests = [

];

module.exports = {
  getAllRequests: () => requests,

  getRequestById: (id) => requests.find((request) => request.id === id),

  getRequestByHost: (host) => requests.find((request) => request.host === host),

  getRequestByStatus: (status) =>
    requests.find((request) => request.status === status),

  createRequest: ({host, status, validate}) => {
    const id = uuid();
    const newRequest = {
      id,
      host,
      status,
      validate,
      dateTimeRequest: new Date(),
    };
    requests.push(newRequest);
    return newRequest;
  },

};
