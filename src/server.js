const dotenv = require('dotenv')
dotenv.config()
const express = require('express');
const router = require('./routes/auth.routes');
const controllerRoute = require('./routes/controller.routes');
const errorMiddleware = require('./middlewares/error-middleware');
const adminRoute = require('./routes/admin.routes');

const app = express()
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/auth', router)
app.use('/controller', controllerRoute)
app.use("/admin", adminRoute);

app.use(errorMiddleware)

const PORT = process.env.PORT || 3000;
app.listen(PORT, console.log(`Servidor iniciado no endereço http://localhost:300\nPorta ${PORT}`))