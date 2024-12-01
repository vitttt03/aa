const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const router = express.Router();
const carModel = require("../models/carModels");
const COMMON = require("../common");

// Middleware bodyParser
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

// Kết nối MongoDB
mongoose
  .connect(COMMON.uri)
  .then(() => console.log("Kết nối MongoDB thành công"))
  .catch((err) => console.error("Lỗi kết nối MongoDB: ", err));

// Route gốc
router.get("/", (req, res) => {
  res.send("API hoạt động.");
});

// Lấy danh sách xe
router.get("/list", async (req, res) => {
  try {
    const cars = await carModel.find();
    console.log("Danh sách xe:", cars);
    res.json(cars);
  } catch (err) {
    console.error("Lỗi khi lấy danh sách xe:", err);
    res.status(500).json({ error: "Lỗi server" });
  }
});

// Thêm xe mới
router.post("/add_xe", async (req, res) => {
  try {
    const { ten, gia, hang, namSX, anh } = req.body;

    if (!ten || !gia || !hang) {
      return res.status(400).json({ error: "Vui lòng nhập đầy đủ thông tin xe." });
    }

    const newCar = await carModel.create({
      ten,
      gia,
      hang,
      namSX,
      anh, // Mặc định sẽ được set trong schema nếu không gửi
    });

    console.log("Thêm xe mới thành công:", newCar);

    // Trả về danh sách mới
    const cars = await carModel.find();
    res.json(cars);
  } catch (err) {
    console.error("Lỗi khi thêm xe:", err);
    res.status(500).json({ error: "Lỗi khi thêm xe" });
  }
});

// Xóa xe
router.delete("/xoa/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await carModel.deleteOne({ _id: id });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: "Không tìm thấy xe để xóa" });
    }

    console.log("Xóa xe thành công:", id);

    // Trả về danh sách mới
    const cars = await carModel.find();
    res.json(cars);
  } catch (err) {
    console.error("Lỗi khi xóa xe:", err);
    res.status(500).json({ error: "Lỗi server" });
  }
});

// Cập nhật xe
router.put("/update/:id", async (req, res) => {
  const { id } = req.params;
  const { ten, gia, hang, namSX, anh } = req.body;

  try {
    const updatedCar = await carModel.findByIdAndUpdate(
      id,
      { ten, gia, hang, namSX, anh },
      { new: true, runValidators: true }
    );

    if (!updatedCar) {
      return res.status(404).json({ error: "Không tìm thấy xe để cập nhật" });
    }

    console.log("Cập nhật xe thành công:", updatedCar);

    // Trả về danh sách mới
    const cars = await carModel.find();
    res.json(cars);
  } catch (err) {
    console.error("Lỗi khi cập nhật xe:", err);
    res.status(500).json({ error: "Lỗi server" });
  }
});

module.exports = router;