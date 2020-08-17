const mongoose = require("mongoose");

const menuSchema = new mongoose.Schema({
  menuName: {
    type: String,
    required: [true, "Indique el nombre del menu"],
  },
  user: {
    type: mongoose.Schema.ObjectId,
    required: [true, "Debe indicarse el usuario propietario del menu"],
  },
  pax: {
    type: Number,
    required: [true, "Indique el numero de comensales"],
  },
  cantidadRecetas: {
    type: Number,
    default: 0,
  },
  analisisNutricional: {
    Kcal: {
      type: Number,
      default: 0,
    },
    prot: {
      type: Number,
      default: 0,
    },
    carbs: {
      type: Number,
      default: 0,
    },
    azucares: {
      type: Number,
      default: 0,
    },
    grasas: {
      type: Number,
      default: 0,
    },
    saturadas: {
      type: Number,
      default: 0,
    },
    etiquetasSalud: {
      type: [String],
    },
    alergias: {
      type: [String],
    },
    avisos: {
      type: [String],
    },
  },
});

const Menu = mongoose.model("Menu", menuSchema);

module.exports = Menu;
