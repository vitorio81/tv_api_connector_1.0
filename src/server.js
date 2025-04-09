const dotenv = require('dotenv')
dotenv.config()
const express = require('express');
const router = require('./routes/routes');

const app = express()
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(router)

const PORT = process.env.PORT || 3000;
app.listen(PORT, console.log(`Servidor iniciado no endereço http://localhost:300\nPorta ${PORT}`))