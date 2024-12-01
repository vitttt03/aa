const mongoose = require("mongoose");

const CarSchema = new mongoose.Schema({
  ten: {
    type: String,
    required: true,
  },
  gia: {
    type: Number,
    required: true,
  },
  hang: {
    type: String,
    required: true,
  },
  namSX: {
    type: Number,
  },
  anh: {
    type: String,
    default: "https://via.placeholder.com/150", // URL ảnh mặc định
  },
});

const CarModel = mongoose.model("car", CarSchema);

module.exports = CarModel;