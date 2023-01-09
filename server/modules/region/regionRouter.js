const express = require("express");
const router = express.Router();

const regionController = require("./regionController");

module.exports = router
	.get("/", regionController.getAllRegions)
	.get("/:id", regionController.getRegionById)
	.get("/:id/districts", regionController.getDistrictByRegionId);
