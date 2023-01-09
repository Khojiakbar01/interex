const express = require("express");
const router = express.Router();
const districtController = require("./districtController");

module.exports = router
	.get("/", districtController.getAllDistricts)
	.get("/:id", districtController.getById);
