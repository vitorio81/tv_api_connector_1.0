require("dotenv").config();
const uuid = require("uuid").v4;

let adminList = [
  {
    id: "1",
    username: "vitorio",
    email: "vitorioteste@gmail.com",
    password: "123456",
  },
];

module.exports = {
  getAllAdmin: () => adminList.map,

  getAdminById: (id) => adminList.find((admin) => admin.id === id),

  getAdminByEmail: (email) => adminList.find((admin) => admin.email === email),

  createAdmin: (username, email, password) => {
    const id = uuid();
    const currentDate = new Date().toISOString().split("T")[0]; 
    const newAdmin = {
      id,
      username,
      email,
      password,
      currentDate,
    };
    adminList.push(newAdmin);
    return newAdmin;
  },

  deleteAdmin: (id) => {
    const adminIndex = adminList.findIndex((admin) => admin.id === id);
    if (adminIndex === -1)
      throw new HttpError(404, "Administrador não encontra no sistema!");
    const deleteAdmin = adminList[adminIndex];
    adminList = adminList.filter((integration) => integration.id !== id);
    return deleteAdmin;
  },
};
