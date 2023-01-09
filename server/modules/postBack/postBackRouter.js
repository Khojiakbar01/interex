const express = require("express");
const roleMiddleware = require("../../core/middlewares/roleMiddleware");
const router = express.Router();
const postBackController = require("./postBackController");
const postNoteValidator = require("../post/postNoteValidator")

module.exports = router
  .get("/rejected/orders", roleMiddleware(["COURIER"]), postBackController.rejectedOrdersBeforeSend)
  .get("/rejected/coming", roleMiddleware(["COURIER"]), postBackController.getTodaysRejectedPost)
  .get("/rejected/count", postBackController.countRejectedOrders)
  .post("/new/rejected", roleMiddleware(["COURIER"]), postBackController.createPostForAllRejectedOrders)
  .put("/:id/send/rejected", roleMiddleware(["COURIER"]), postBackController.sendRejectedPost)
  .get("/rejectedposts", roleMiddleware(["ADMIN", "COURIER"]), postBackController.getAllRejectedPosts)
  .get("/rejectedposts/:id", roleMiddleware(["ADMIN", "COURIER"]), postBackController.getAllRejectedOrdersInPost)
  .put("/new/receiverejectedpost", roleMiddleware(["ADMIN"]), postBackController.receiveRejectedOrders)
