const express = require("express");
const roleMiddleware = require("../../core/middlewares/roleMiddleware");
const userController = require("./userController");
const { updateValidator, createValidator, passwordChangeValidator } = require("./userValidator");

const router = express.Router();

router
	.get("/", roleMiddleware(["SUPER_ADMIN", "ADMIN"]), userController.getUsers)
	.post( 
		"/",
		roleMiddleware("SUPER_ADMIN"),
		createValidator,
		userController.createUsers
	);
router.get("/roles", userController.getUserRole);
router.get("/tariffs", userController.getTariff);
router
	.route("/:id")
	.get(roleMiddleware(["SUPER_ADMIN", "ADMIN"]), userController.getById)
	.put(updateValidator, userController.updateUsers);
router.put(
	"/:id/status",
	roleMiddleware("SUPER_ADMIN"),
	userController.updateStatus
);
router.put(
	"/:id/password",
	passwordChangeValidator,
	userController.updatePassword
);

module.exports = router;
