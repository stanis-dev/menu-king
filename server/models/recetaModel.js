const mongoose = require('mongoose');

const recetaModel = new mongoose.Schema({
  recetaNombre: {
    type: String,
    required: [true, 'Por favor, introduzca el nombre de la receta'],
  },
  recetaImagen: {
    type: String,
    default: '../assets/img/receta.jpg',
  },
  user: {
    type: mongoose.Schema.ObjectId,
    required: [true, 'El id de usuario es obligatorio'],
    ref: 'User',
  },
  ingredientes: [
    {
      ingrediente: {
        type: String,
        require: [true, 'El nombre de ingrediente es obligatorio'],
      },
      ingredienteCantidad: {
        type: Number,
        required: [
          true,
          'La cantidad en gramos del ingrediente os obligatoria',
        ],
      },
    },
  ],
  analisisNutricional: {
    caloriasTotal: {
      type: Number,
      required: [true, 'El número total de calorías es obligatorio'],
    },
    raciones: {
      type: Number,
      required: [true, 'El número de raciones es obligatorio'],
    },
    caloriasRacion: {
      type: Number,
      required: [true, 'El número de calorias por ración es obligatorio'],
    },
    prot: {
      type: Number,
      required: [true, 'La cantidad de proteínas es obligatoria'],
    },
    carbs: {
      type: Number,
      required: [true, 'La cantidad de carbohidratos es obligatoria'],
    },
    azucares: {
      type: Number,
      required: [true, 'La cantidad de azucares es obligatoria'],
    },
    grasas: {
      type: Number,
      required: [true, 'La cantidad de grasas es obligatoria'],
    },
    saturadas: {
      type: Number,
      required: [true, 'La cantidad de grasas saturadas es obligatoria'],
    },
    etiquetasSalud: [String],
    alergias: [String],
    avisos: [String],
  },
});

const Receta = mongoose.model('Receta', recetaModel);

module.exports = Receta;
