const packageBackControllers = require("./packageBackControllers");
const roleMiddleware = require("../../core/middlewares/roleMiddleware");
const router = require("express").Router();

router
  .route("/")
  .get(
    roleMiddleware(["STORE_OWNER", "ADMIN"]),
    packageBackControllers.getAllPackageBack
  );
router
  .route("/:id/orders")
  .get(
    roleMiddleware(["STORE_OWNER", "ADMIN"]),
    packageBackControllers.getOrdersbyPackageBack
  )
  .put(
    roleMiddleware(["STORE_OWNER"]),
    packageBackControllers.receiveOrdersinPackageBack
  );
module.exports = router;
