const express = require("express");
const router = express.Router();
const postController = require("./postController");
const roleMiddleware = require("../../core/middlewares/roleMiddleware")
const postNoteValidator = require("./postNoteValidator")

module.exports = router
	.get("/", roleMiddleware(["SUPER_ADMIN", "ADMIN", "COURIER"]), postController.getAllPosts)
	.get("/:id", roleMiddleware(["SUPER_ADMIN", "ADMIN", "COURIER"]), postController.getPostById)
	.get("/regions/:id", roleMiddleware(["ADMIN"]), postController.getPostByRegionId)
	.get("/:id/orders", roleMiddleware(["SUPER_ADMIN", "ADMIN", "COURIER"]), postController.getOrdersInPost)
	.get("/:regionId/regionorders", roleMiddleware(["ADMIN", "COURIER"]), postController.ordersBeforeSend)
	.get("/new/regions", postController.existRegions)
	.get("/status/new", roleMiddleware(["ADMIN", "COURIER"]), postController.newPosts)
	.get("/new/coming", roleMiddleware(["ADMIN", "COURIER"]), postController.getTodaysPost)
	.put("/new/recieve", roleMiddleware(["COURIER"]), postController.recievePost)
	.post("/new", roleMiddleware(["ADMIN", "COURIER"]), postController.createPostForAllOrders)
	.put("/new/customized", roleMiddleware(["ADMIN", "COURIER"]), postController.createPostForCustomOrders)
	.put("/:id/send", roleMiddleware(["ADMIN"]), postController.sendPost);
