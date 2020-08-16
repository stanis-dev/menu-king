const mongoose = require("mongoose");

const menuSchema = new mongoose.Schema({
  menuName: {
    type: string,
    required: [true, "Indique el nombre del menu"],
  },
  pax: {
    type: Number,
    required: [true, "Indique el numero de comensales"],
  },
  recetas: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "Receta",
    },
  ],
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
    observaciones: {
      type: [String],
    },
  },
});

const Menu = mongoose.model("Menu", menuSchema);

module.exports = Menu;
