const router = require("express").Router();
const {
  ADMIN,
  COURIER,
  STORE_OWNER,
  SUPER_ADMIN,
} = require("../../core/constants/userRole");
const roleMiddleware = require("../../core/middlewares/roleMiddleware");
const orderControllers = require("./orderControllers");
const orderValidator = require("./orderExpressValidator");
const reportController = require("../report/reportController");

router
  .route("/")
  .get(
    roleMiddleware([ADMIN, SUPER_ADMIN]),
    orderControllers.getAllOrders
  )
  .get(
    roleMiddleware([ADMIN]),
    orderControllers.adminOrderStatus
  )
  .post(
    roleMiddleware([STORE_OWNER]),
    orderValidator.creatingOrderValidator,
    orderControllers.createOrder
  );
router.get("/download", reportController.exportOrders);
router.get("/statistics", reportController.getStatistics);
router.get(
  "/statisticcount",
  reportController.countsInRegionsAndMonths
);
router
  .get(
    "/delivered",
    roleMiddleware([COURIER]),
    orderControllers.getDeliveredOrders
  )
  .get(
    "/delivered/daily",
    roleMiddleware([COURIER]),
    orderControllers.getDailyOrders
  )
  .put(
    "/delivered/:id/status",
    roleMiddleware([COURIER]),
    orderControllers.changeStatusDeliveredOrders
  );
router
  .route("/myorders")
  .get(
    roleMiddleware([STORE_OWNER]),
    orderControllers.getMyOrders
  );
router
  .route("/status")
  .get(orderControllers.getAllOrderStatus);
router
  .route("/devprice")
  .get(orderControllers.getAllDeliveryPrice);
router
  .route("/:id")
  .get(orderControllers.getOrderById)
  .put(
    roleMiddleware([STORE_OWNER]),
    orderValidator.updatedOrderValidator,
    orderControllers.updateOrder
  )
  .patch(
    roleMiddleware([SUPER_ADMIN, ADMIN]),
    orderControllers.changeOrderStatus
  )
  .delete(
    roleMiddleware([STORE_OWNER]),
    orderControllers.deleteOrder
  );

router.route("/:id/edit").get(orderControllers.editOrder);

router
  .route("/:id/devprice")
  .patch(
    roleMiddleware([ADMIN]),
    orderControllers.changeDevPrice
  );

module.exports = router;
