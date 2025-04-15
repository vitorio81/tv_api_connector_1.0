const dotenv = require('dotenv')
dotenv.config()
const express = require('express');
const apiAuth = require("./routes/api_auth.route");
const adminRouters = require("./routes/admin_routes.route");
const errorMiddleware = require('./middlewares/error-middleware');
const adminAuthRoute = require('./routes/admin_auth..route');

const app = express()
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/auth', apiAuth)
app.use("/administration", adminRouters);
app.use("/admin", adminAuthRoute);

app.use(errorMiddleware)

const PORT = process.env.PORT || 3000;
app.listen(PORT, console.log(`Servidor iniciado no endereço http://localhost:300\nPorta ${PORT}`))