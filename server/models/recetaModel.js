const mongoose = require("mongoose");
const Menu = require("./menuModel");

const recetaSchema = new mongoose.Schema({
  recetaNombre: {
    type: String,
    required: [true, "Por favor, introduzca el nombre de la receta"],
  },
  recetaImagen: {
    type: String,
    default: "../assets/img/receta.jpg",
  },
  user: {
    type: mongoose.Schema.ObjectId,
    required: [true, "El id de usuario es obligatorio"],
    ref: "User",
  },
  menu: {
    type: mongoose.Schema.ObjectId,
    required: [true, "Se debe indicar el id del menu"],
    ref: "Menu",
  },
  ingredientes: [
    {
      ingrediente: {
        type: String,
        require: [true, "El nombre de ingrediente es obligatorio"],
      },
      ingredienteCantidad: {
        type: Number,
        required: [
          true,
          "La cantidad en gramos del ingrediente os obligatoria",
        ],
      },
    },
  ],
  analisisNutricional: {
    caloriasTotal: {
      type: Number,
      required: [true, "El número total de calorías es obligatorio"],
    },
    raciones: {
      type: Number,
      required: [true, "El número de raciones es obligatorio"],
    },
    caloriasRacion: {
      type: Number,
      required: [true, "El número de calorias por ración es obligatorio"],
    },
    prot: {
      type: Number,
      required: [true, "La cantidad de proteínas es obligatoria"],
    },
    carbs: {
      type: Number,
      required: [true, "La cantidad de carbohidratos es obligatoria"],
    },
    azucares: {
      type: Number,
      required: [true, "La cantidad de azucares es obligatoria"],
    },
    grasas: {
      type: Number,
      required: [true, "La cantidad de grasas es obligatoria"],
    },
    saturadas: {
      type: Number,
      required: [true, "La cantidad de grasas saturadas es obligatoria"],
    },
    etiquetasSalud: [String],
    alergias: [String],
    avisos: [String],
  },
});

recetaSchema.statics.calcNutrientes = async function (menuId) {
  const stats = await Receta.aggregate([
    { $match: { menu: menuId } },
    {
      $group: {
        _id: null,
        cantidadRecetas: { $sum: 1 },
        totalKcals: {
          $sum: "$analisisNutricional.caloriasTotal",
        },
        totalProts: { $sum: "$analisisNutricional.prot" },
        totalCarbs: { $sum: "$analisisNutricional.carbs" },
        totalAzucares: { $sum: "$analisisNutricional.azucares" },
        totalGrasas: { $sum: "$analisisNutricional.grasas" },
        totalSaturadas: { $sum: "$analisisNutricional.saturadas" },
        etiquetasSalud: {
          $addToSet: "$analisisNutricional.etiquetasSalud",
        },
        alergias: {
          $addToSet: "$analisisNutricional.alergias",
        },
        avisos: {
          $addToSet: "$analisisNutricional.avisos",
        },
      },
    },
    {
      $project: {
        _id: 0,
        cantidadRecetas: 1,
        totalKcals: 1,
        totalProts: 1,
        totalCarbs: 1,
        totalAzucares: 1,
        totalGrasas: 1,
        totalSaturadas: 1,
        etiquetasSalud: {
          $reduce: {
            input: "$etiquetasSalud",
            initialValue: [],
            in: { $setUnion: ["$$value", "$$this"] },
          },
        },
        alergias: {
          $reduce: {
            input: "$alergias",
            initialValue: [],
            in: { $setUnion: ["$$value", "$$this"] },
          },
        },
        avisos: {
          $reduce: {
            input: "$avisos",
            initialValue: [],
            in: { $setUnion: ["$$value", "$$this"] },
          },
        },
      },
    },
  ]);

  await Menu.findByIdAndUpdate(menuId, {
    cantidadRecetas: stats[0].cantidadRecetas,
    analisisNutricional: {
      Kcal: stats[0].totalKcals,
      prot: stats[0].totalProts,
      carbs: stats[0].totalCarbs,
      azucares: stats[0].totalAzucares,
      grasas: stats[0].totalGrasas,
      saturadas: stats[0].totalSaturadas,
      alergias: stats[0].alergias,
      avisos: stats[0].avisos,
    },
  });
};

recetaSchema.post("save", function () {
  this.constructor.calcNutrientes(this.menu);
});

const Receta = mongoose.model("Receta", recetaSchema);

module.exports = Receta;
