const mongoose = require('mongoose');
const dotenv = require('dotenv');

const app = require('./app');

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor escuchando en puerto: ${PORT}`);
});
