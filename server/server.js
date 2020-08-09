const mongoose = require('mongoose');
const dotenv = require('dotenv');

const app = require('./app');

dotenv.config({ path: './config.env' });

const database = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

mongoose.connect(
  database,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  },
  () => {
    console.log('✔ Base de datos conectada --');
  }
);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`✔ Servidor escuchando en puerto: ${PORT} --`);
});
