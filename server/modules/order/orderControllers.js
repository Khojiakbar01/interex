const OrderItem = require("../orderitem/OrderItem");
const Package = require("../package/Package");
const { Op } = require("sequelize");
const catchAsync = require("../../core/utils/catchAsync");
const { validationResult } = require("express-validator");
const AppError = require("../../core/utils/AppError");
const QueryBuilder = require("../../core/utils/QueryBuilder");
const statusOrder = require("../../core/constants/orderStatus");
const statusOrderUz = require("../../core/constants/orderStatusUz");
const priceDelivery = require("../../core/constants/deliveryPrice");
const RegionModel = require("../region/Region");
const DistrictModel = require("../district/District");
const User = require("../user/User");
const rolesUser = require("../../core/constants/userRole");
const statusPackage = require("../../core/constants/packageStatus");
const statusPackageUz = require("../../core/constants/packageStatusUz");
const Order = require("./Order");
const Tracking = require("../tracking/Tracking");
const userRoles = require("../../core/constants/userRole");

exports.getAllOrders = catchAsync(
  async (req, res, next) => {
    const { userRole } = req.user;
    const queryBuilder = new QueryBuilder(req.query);
    queryBuilder
      .filter()
      .paginate()
      .limitFields()
      .search(["recipientPhoneNumber", "recipient", "id"])
      .sort();
    queryBuilder.queryOptions.include = [
      {
        model: User,
        as: "storeOwner",
        attributes: ["storeName"],
      },
      {
        model: RegionModel,
        as: "region",
        attributes: ["name"],
      },
      {
        model: DistrictModel,
        as: "district",
        attributes: ["name"],
      },
    ];
    if (
      userRole === userRoles.SUPER_ADMIN ||
      userRole === userRoles.ADMIN
    ) {
      const customOrderStatuses =
        Object.values(statusOrder).slice(2);
      queryBuilder.queryOptions.where = {
        orderStatus: {
          [Op.in]: customOrderStatuses,
        },
        ...queryBuilder.queryOptions.where,
      };
    }
    let allOrders = await Order.findAndCountAll({
      ...queryBuilder.queryOptions,
    });
    allOrders = queryBuilder.createPagination(allOrders);
    res.json({
      status: "success",
      message: "Barcha buyurtmalar",
      error: null,
      data: {
        ...allOrders,
      },
    });
  }
);

exports.createOrder = catchAsync(async (req, res, next) => {
  const validationErrors = validationResult(req);
  if (!validationErrors.isEmpty()) {
    let err = new AppError("Validatsiya xatosi", 403);
    err.isOperational = false;
    err.errors = validationErrors;
    return next(err);
  }
  const { userRoleUz } = req.user;

  let existedPackage = await Package.findOne({
    where: {
      [Op.and]: [
        { storeOwnerId: { [Op.eq]: req.user.id } },
        {
          packageStatus: {
            [Op.eq]: statusPackage.STATUS_NEW,
          },
        },
      ],
    },
    order: [["createdAt", "DESC"]],
  });

  if (!existedPackage) {
    existedPackage = await Package.create({
      storeOwnerId: req.user.id,
    });
  }
  const storeOwnerId = req.user.id;
  const order = req.body.orders[0];

  const exisOrder = await Order.findOne({
    where: {
      [Op.and]: [
        {
          recipientPhoneNumber: {
            [Op.eq]: order.recipientPhoneNumber,
          },
        },
        {
          orderStatus: { [Op.eq]: statusOrder.STATUS_NEW },
        },
      ],
    },
  });
  if (exisOrder === null || (req.query.phone === "free" && exisOrder)) {
    const countOrders = await Order.count();
    const regId = +order.regionId;
    let regSeria;
    let countForId = countOrders + 1;
    switch (regId) {
      case 1:
        regSeria = 95;
        break;
      case 2:
        regSeria = 60;
        break;
      case 3:
        regSeria = 80;
        break;
      case 4:
        regSeria = 25;
        break;
      case 5:
        regSeria = 70;
        break;
      case 6:
        regSeria = 85;
        break;
      case 7:
        regSeria = 50;
        break;
      case 8:
        regSeria = 30;
        break;
      case 9:
        regSeria = 75;
        break;
      case 10:
        regSeria = 20;
        break;
      case 11:
        regSeria = 10;
        break;
      case 12:
        regSeria = 40;
        break;
      case 13:
        regSeria = 90;
        break;
      case 14:
        regSeria = 01;
        break;
      default:
        "buyurtma";
        break;
    }
    id = `${regSeria}-${countForId}`;
    let itemByNote = "";
    console.log(id);
    const orderInfo = {
      id,
      recipient: order.recipient,
      regionId: order.regionId,
      note: `${userRoleUz}: ${order.note}`,
      recipientPhoneNumber: order.recipientPhoneNumber,
      districtId: order.districtId,
      packageId: existedPackage.id,
      storeOwnerId,
    };

    newOrder = await Order.create(orderInfo);
    let items = [];
    let sum = 0;
    order.orderItems?.forEach(item => {
      itemByNote =
        itemByNote +
        `${item.productName?.replace(
          / /g,
          "_"
        )}-${+item.quantity}/${+item.price},`;
      items.push({
        productName: item.productName,
        quantity: item.quantity,
        orderItemTotalPrice: +item.price,
        orderId: newOrder.id,
      });
    });
    items?.forEach(item => {
      sum += item.orderItemTotalPrice;
    });

    await OrderItem.bulkCreate(items);
    newOrder.note = itemByNote + " " + newOrder.note;
    newOrder.totalPrice = sum;
    newOrder.packageId = existedPackage.id;
    await newOrder.save();
    existedPackage.packageTotalPrice += newOrder.totalPrice;
    await existedPackage.save();
    res.status(201).json({
      status: "success",
      message: "yangi buyurtma  qo`shildi",
      errors: null,
      data: null,
    });
  } else {
    return next(
      new AppError("buyurtmani raqami takrorlansinmi?", 400)
    );
  }
});

exports.getOrderById = catchAsync(
  async (req, res, next) => {
    const { id } = req.params;
    const orderById = await Order.findByPk(id, {
      include: [
        {
          model: DistrictModel,
          as: "district",
          attributes: ["name"],
        },
        {
          model: RegionModel,
          as: "region",
          attributes: ["name"],
        },
        { model: OrderItem, as: "items" },
        { model: Tracking, as: "tracking" },
        {
          model: User,
          as: "storeOwner",
          attributes: ["storeName"],
        },
      ],
    });

    if (!orderById) {
      return next(
        new AppError("bunday ID order topilmadi", 404)
      );
    }

    res.status(200).json({
      status: "success",
      message: `${orderById.recipient} mijozning buyurtmasi`,
      error: null,
      data: { orderById },
    });
  }
);

exports.changeOrderStatus = catchAsync(
  async (req, res, next) => {
    const { id } = req.params;
    const { userRole } = req.user;
    const { orderStatus } = req.body;
    let orderById = await Order.findByPk(id);
    let orderStatusUz;
    if (userRole === rolesUser.ADMIN) {
      orderStatus === statusOrder.STATUS_ACCEPTED
        ? (orderStatusUz = statusOrderUz.STATUS_ADMIN_OLDI)
        : (orderStatusUz =
            statusOrderUz.STATUS_ADMIN_TOPILMADI);
      const dprice = orderById.deliveryPrice;
      orderById = await orderById.update({
        orderStatus,
        orderStatusUz,
      });
      if (
        orderById.orderStatus ===
        statusOrder.STATUS_ACCEPTED
      ) {
        await orderById.update({
          deliveryPrice: dprice || 50000,
        });
      } else {
        await orderById.update({ deliveryPrice: null });
      }
      const existedPackage = await Package.findByPk(
        orderById.packageId
      );
      const isNewOrders = await Order.count({
        where: {
          [Op.and]: [
            { packageId: { [Op.eq]: existedPackage.id } },
            {
              orderStatus: {
                [Op.eq]: statusOrder.STATUS_NEW,
              },
            },
          ],
        },
      });
      if (isNewOrders === 0) {
        await existedPackage.update({
          packageStatus: statusPackage.STATUS_OLD,
          packageStatusUz: statusPackageUz.STATUS_ESKI,
        });
      }
    } else if (userRole === rolesUser.SUPER_ADMIN) {
      if (
        orderById.orderStatus === statusOrder.STATUS_SOLD ||
        orderById.orderStatus ===
          statusOrder.STATUS_REJECTED
      ) {
        (orderStatusUz = statusOrderUz.STATUS_KUTILMOQDA),
          await orderById.update({
            orderStatus: statusOrder.STATUS_PENDING,
            orderStatusUz,
          });
      } else {
        res.send("O`zgartirib bo`lmaydi");
      }
    }

    const orderForTracking = await Order.findByPk(id);
    await Tracking.create({
      orderId: id,
      fromStatus: statusOrder.STATUS_NEW,
      toStatus: orderForTracking.orderStatus,
    });

    res.status(203).json({
      status: "success",
      message: "order statusi o`zgardi",
      error: null,
      data: null,
    });
  }
);

exports.deleteOrder = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const orderById = await Order.findByPk(id);
  const packageByOrderId = await Package.findOne({
    where: { id: { [Op.eq]: orderById.packageId } },
  });

  if (orderById.orderStatus !== statusOrder.STATUS_NEW) {
    return next(
      new AppError("Buyurtmani o`chirib bo`lmaydi")
    );
  }
  packageByOrderId.packageTotalPrice =
    packageByOrderId.packageTotalPrice -
    orderById.totalPrice;
  await packageByOrderId.save();
  if (packageByOrderId.packageTotalPrice < 1) {
    await packageByOrderId.destroy();
  }

  await orderById.destroy();
  const isNewOrdersInPackage = await Order.count({
    where: {
      packageId: { [Op.eq]: packageByOrderId.id },
      orderStatus: { [Op.eq]: statusOrder.STATUS_NEW },
    },
  });
  if (isNewOrdersInPackage === 0) {
    packageByOrderId.packageStatus =
      statusPackage.STATUS_OLD;
    packageByOrderId.packageStatusUz =
      statusPackageUz.STATUS_ESKI;
  } else {
    packageByOrderId.packageStatus =
      statusPackage.STATUS_NEW;
    packageByOrderId.packageStatusUz =
      statusPackageUz.STATUS_YANGI;
  }
  await packageByOrderId.save();
  res.json({
    status: "success",
    message: "buyurtma o`chirildi",
    error: null,
    data: null,
  });
});

exports.adminOrderStatus = catchAsync(
  async (req, res, next) => {
    let orderStatusVariables = [
      statusOrder.STATUS_ACCEPTED,
      statusOrder.STATUS_NOT_EXIST,
    ];
    res.json(orderStatusVariables);
  }
);

exports.editOrder = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const editOrderbyId = await Order.findOne({
    where: { id: { [Op.eq]: id } },
    attributes: {
      exclude: [
        "createdAt",
        "updatedAt",
        "orderStatus",
        "deliveryPrice",
        "totalPrice",
        "packageId",
      ],
    },
  });

  if (!editOrderbyId) {
    return next(
      new AppError("bunday buyurtma topilmadi", 404)
    );
  }

  res.json({
    data: editOrderbyId,
  });
});

exports.updateOrder = catchAsync(async (req, res, next) => {
  const userId = req.user.id;
  const { id } = req.params;

  const {
    recipient,
    recipientPhoneNumber,
    regionId,
    districtId,
    orderItems,
    note,
  } = req.body;

  const myPackage = await Package.findOne({
    where: { storeOwnerId: { [Op.eq]: userId } },
  });

  const orderById = await Order.findByPk(id);

  await OrderItem.destroy({
    where: { orderId: { [Op.eq]: orderById.id } },
  });
  myPackage.packageTotalPrice -= orderById.totalPrice;
  await myPackage.save();

  await orderById.update({
    recipient,
    recipientPhoneNumber,
    regionId,
    districtId,
    note,
  });
  let items = [];
  let sum = 0;
  orderItems?.forEach(item => {
    items.push({
      productName: item.productName,
      quantity: item.quantity,
      orderItemTotalPrice: +item.price,
      orderId: orderById.id,
    });
  });
  items.forEach(item => {
    sum += item.orderItemTotalPrice;
  });

  await OrderItem.bulkCreate(items);

  orderById.totalPrice = sum;
  await orderById.save();
  myPackage.packageTotalPrice += orderById.totalPrice;
  await myPackage.save();
  res.status(203).json({
    status: "success",
    message: "buyurtma taxrirlandi",
    error: null,
    data: null,
  });
});

exports.getMyOrders = catchAsync(async (req, res, next) => {
  const userId = req.user.id;
  req.query.storeOwnerId = userId;
  const queryBuilder = new QueryBuilder(req.query);
  queryBuilder
    .filter()
    .paginate()
    .limitFields()
    .search(["recipientPhoneNumber", "recipient"])
    .sort();

  queryBuilder.queryOptions.include = [
    {
      model: DistrictModel,
      as: "district",
      attributes: ["name"],
    },
    {
      model: RegionModel,
      as: "region",
      attributes: ["name"],
    },
  ];
  let myOrders = await Order.findAndCountAll(
    queryBuilder.queryOptions
  );
  myOrders = queryBuilder.createPagination(myOrders);

  res.json({
    status: "success",
    message: `${req.user.firstName} - ${req.user.userRole} ning ro\`yhatdan o\`tkazgan barcha buyurtmalari`,
    error: null,
    data: { ...myOrders },
  });
});

exports.getAllDeliveryPrice = (req, res, next) => {
  const allPrice = Object.values(priceDelivery);
  res.json(allPrice);
};

exports.getAllOrderStatus = (req, res, next) => {
  const { userRole } = req.user;

  let allOrderStatus = [];

  let orderStatus = Object.values(statusOrder);
  let orderStatusUz = Object.values(statusOrderUz);

  if (userRole === "COURIER") {
    orderStatus = orderStatus.slice(4, 12);
    orderStatusUz = orderStatusUz.slice(4, 12);

    orderStatus?.forEach((_, i) => {
      allOrderStatus.push({
        id: i + 1,
        uz: orderStatusUz[i],
        en: orderStatus[i],
      });
    });
  } else {
    orderStatus?.forEach((_, i) => {
      allOrderStatus.push({
        id: i + 1,
        uz: orderStatusUz[i],
        en: orderStatus[i],
      });
    });
  }
  res.json({
    status: "success",
    message: "All order status",
    data: {
      allOrderStatus,
    },
  });
};
exports.changeDevPrice = catchAsync(
  async (req, res, next) => {
    const { id } = req.params;
    const { deliveryPrice } = req.body;

    const existedOrder = await Order.findByPk(id);
    if (!existedOrder) {
      return next(
        new AppError("Bunday order mavjud emas", 404)
      );
    }
    existedOrder.update({
      deliveryPrice: deliveryPrice || 50000,
    });
    res.json({
      status: "success",
      message: "buyurtma yetkazish to`lovi qo`shildi",
      error: "null",
      data: {
        ...existedOrder,
      },
    });
  }
);

exports.getDeliveredOrders = catchAsync(
  async (req, res, next) => {
    const { regionId } = req.user;
    const queryBuilder = new QueryBuilder(req.query);
    let deliveredOrders = [];
    let ordersArrInPost = [];

    queryBuilder.queryOptions.include = [
      {
        model: RegionModel,
        as: "region",
        attributes: ["name"],
      },
      {
        model: DistrictModel,
        as: "district",
        attributes: ["name"],
      },
    ];

    queryBuilder
      .filter()
      .paginate()
      .limitFields()
      .search(["recipientPhoneNumber", "recipient"])
      .sort();

    const region = await RegionModel.findOne({
      attributes: ["id", "name"],
      where: {
        id: {
          [Op.eq]: regionId,
        },
      },
    });
    const orderStatuses = Object.values(statusOrder).slice(
      4,
      12
    );
    if (region?.name === "Samarqand viloyati") {
      queryBuilder.queryOptions.where = {
        regionId: {
          [Op.eq]: regionId,
        },
        districtId: {
          [Op.notIn]: [101, 106],
        },
        orderStatus: {
          [Op.in]: orderStatuses,
        },
        ...queryBuilder.queryOptions.where,
      };
      deliveredOrders = await Order.findAndCountAll(
        queryBuilder.queryOptions
      );
      deliveredOrders =
        queryBuilder.createPagination(deliveredOrders);
      deliveredOrdersArrInPost =
        deliveredOrders.content.map(order => {
          return order.dataValues.id;
        });
    } else if (region?.name === "Navoiy viloyati") {
      queryBuilder.queryOptions.where = {
        [Op.or]: {
          regionId: {
            [Op.eq]: regionId,
          },
          districtId: {
            [Op.in]: [101, 106],
          },
        },
        orderStatus: {
          [Op.in]: orderStatuses,
        },
        ...queryBuilder.queryOptions.where,
      };
      deliveredOrders = await Order.findAndCountAll(
        queryBuilder.queryOptions
      );
      deliveredOrders =
        queryBuilder.createPagination(deliveredOrders);
      ordersArrInPost = deliveredOrders.content.map(
        order => {
          return order.dataValues.id;
        }
      );
    } else if (region?.name === "Xorazm viloyati") {
      queryBuilder.queryOptions.where = {
        regionId: {
          [Op.in]: [regionId, 1],
        },
        orderStatus: {
          [Op.in]: orderStatuses,
        },
        ...queryBuilder.queryOptions.where,
      };
      deliveredOrders = await Order.findAndCountAll(
        queryBuilder.queryOptions
      );
      deliveredOrders =
        queryBuilder.createPagination(deliveredOrders);
      ordersArrInPost = deliveredOrders.content.map(
        order => {
          return order.dataValues.id;
        }
      );
    } else {
      const orderStatuses = Object.values(
        statusOrder
      ).slice(4, 12);
      queryBuilder.queryOptions.where = {
        regionId: {
          [Op.eq]: regionId,
        },
        orderStatus: {
          [Op.in]: orderStatuses,
        },
        ...queryBuilder.queryOptions.where,
      };
      deliveredOrders = await Order.findAndCountAll(
        queryBuilder.queryOptions
      );
      deliveredOrders =
        queryBuilder.createPagination(deliveredOrders);
      ordersArrInPost = deliveredOrders.content.map(
        order => {
          return order.dataValues.id;
        }
      );
    }

    res.json({
      status: "success",
      message: "Yetkazib berilgan buyurtmalar",
      error: null,
      data: {
        ...deliveredOrders,
        ordersArrInPost,
      },
    });
  }
);

exports.changeStatusDeliveredOrders = catchAsync(
  async (req, res, next) => {
    const { regionId, userRoleUz } = req.user;
    const { id } = req.params;
    const { orderStatus, note, expense } = req.body;
    const postOrdersById = await Order.findByPk(id, {
      where: {
        regionId: {
          [Op.eq]: regionId,
        },
      },
    });
    const oldStatus = postOrdersById.orderStatus;
    let orderStatusUz;
    orderStatus === statusOrder.STATUS_SOLD
      ? (orderStatusUz = statusOrderUz.STATUS_SOTILDI)
      : "";
    orderStatus === statusOrder.STATUS_PENDING
      ? (orderStatusUz = statusOrderUz.STATUS_KUTILMOQDA)
      : "";
    orderStatus === statusOrder.STATUS_REJECTED
      ? (orderStatusUz = statusOrderUz.STATUS_OTKAZ)
      : "";
    const postOrderStatuses = Object.values(
      statusOrder
    ).slice(6, 9);
    const postOrderStatusesUz = Object.values(
      statusOrderUz
    ).slice(6, 9);
    const postOrderStatusChange = postOrderStatuses.find(
      e => e === orderStatus
    );
    const postOrderStatusChangeUz =
      postOrderStatusesUz.find(e => e === orderStatusUz);
    if (
      postOrdersById.orderStatus === "DELIVERED" ||
      postOrdersById.orderStatus === "PENDING"
    ) {
      await postOrdersById.update({
        orderStatus: postOrderStatusChange,
        orderStatusUz: postOrderStatusChangeUz,
        note: `${postOrdersById.dataValues.note} ${userRoleUz}: ${note}`,
        expense,
      });
    }

    await Tracking.create({
      orderId: id,
      fromStatus: oldStatus,
      toStatus: orderStatus,
    });

    res.status(203).json({
      status: "success",
      message: "Post orderining statusi o'zgardi",
      error: null,
      data: {
        note,
        expense,
      },
    });
  }
);

exports.getDailyOrders = catchAsync(
  async (req, res, next) => {
    const { regionId } = req.user;
    const queryBuilder = new QueryBuilder(req.query);
    let ordersOneDay = [];
    let oneDayOrdersArrInPost = [];

    queryBuilder.queryOptions.include = [
      {
        model: RegionModel,
        as: "region",
        attributes: ["name"],
      },
      {
        model: DistrictModel,
        as: "district",
        attributes: ["name"],
      },
    ];

    queryBuilder
      .filter()
      .paginate()
      .limitFields()
      .search(["recipientPhoneNumber", "recipient"])
      .sort();

    const region = await RegionModel.findOne({
      attributes: ["id", "name"],
      where: {
        id: {
          [Op.eq]: regionId,
        },
      },
    });

    if (region.name === "Samarqand viloyati") {
      queryBuilder.queryOptions.where = {
        regionId: {
          [Op.eq]: regionId,
        },
        districtId: {
          [Op.notIn]: [101, 106],
        },
        orderStatus: {
          [Op.in]: [
            statusOrder.STATUS_PENDING,
            statusOrder.STATUS_DELIVERED,
          ],
        },
        ...queryBuilder.queryOptions.where,
      };
      ordersOneDay = await Order.findAndCountAll(
        queryBuilder.queryOptions
      );
      ordersOneDay =
        queryBuilder.createPagination(ordersOneDay);
      oneDayOrdersArrInPost = ordersOneDay.content.map(
        order => {
          return order.dataValues.id;
        }
      );
    } else if (region.name === "Navoiy viloyati") {
      queryBuilder.queryOptions.where = {
        [Op.or]: {
          regionId: {
            [Op.eq]: regionId,
          },
          districtId: {
            [Op.in]: [101, 106],
          },
        },
        orderStatus: {
          [Op.in]: [
            statusOrder.STATUS_PENDING,
            statusOrder.STATUS_DELIVERED,
          ],
        },
        ...queryBuilder.queryOptions.where,
      };
      ordersOneDay = await Order.findAndCountAll(
        queryBuilder.queryOptions
      );
      ordersOneDay =
        queryBuilder.createPagination(ordersOneDay);
      oneDayOrdersArrInPost = ordersOneDay.content.map(
        order => {
          return order.dataValues.id;
        }
      );
    } else {
      queryBuilder.queryOptions.where = {
        regionId: {
          [Op.eq]: regionId,
        },
        districtId: {
          [Op.notIn]: [101, 106],
        },
        orderStatus: {
          [Op.in]: [
            statusOrder.STATUS_PENDING,
            statusOrder.STATUS_DELIVERED,
          ],
        },
        ...queryBuilder.queryOptions.where,
      };
      ordersOneDay = await Order.findAndCountAll(
        queryBuilder.queryOptions
      );
      ordersOneDay =
        queryBuilder.createPagination(ordersOneDay);
      oneDayOrdersArrInPost = ordersOneDay.content.map(
        order => {
          return order.dataValues.id;
        }
      );
    }
    res.json({
      status: "success",
      message: "Kunlik yetkazib beriladigan buyurtmalar",
      error: null,
      data: {
        ...ordersOneDay,
        oneDayOrdersArrInPost,
      },
    });
  }
);
