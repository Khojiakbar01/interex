const Post = require("./Post");
const { Op } = require("sequelize");
const catchAsync = require("../../core/utils/catchAsync");
const AppError = require("../../core/utils/AppError");
const QueryBuilder = require("../../core/utils/QueryBuilder");
const Order = require("../order/Order");
const Region = require("../region/Region");
const userRoles = require("../../core/constants/userRole");
const postStatuses = require("../../core/constants/postStatus");
const postStatusesUz = require("../../core/constants/postStatusUz");
const orderStatuses = require("../../core/constants/orderStatus");
const orderStatusesUz = require("../../core/constants/orderStatusUz");
const District = require("../district/District");
const Tracking = require("../tracking/Tracking");
const { validationResult } = require("express-validator");

exports.getAllPosts = catchAsync(async (req, res, next) => {
  const { userRole, regionId } = req.user;
  const queryBuilder = new QueryBuilder(req.query);
  queryBuilder
    .limitFields()
    .filter()
    .paginate()
    .search(["note"]);

  queryBuilder.queryOptions.order = [["createdAt", "desc"]];
  queryBuilder.queryOptions.include = [
    { model: Region, as: "region", attributes: ["name"] },
  ];
  if (userRole === "COURIER") {
    const postStatusArr = Object.values(postStatuses).slice(
      1,
      5
    );
    queryBuilder.queryOptions.where = {
      postStatus: {
        [Op.in]: postStatusArr,
      },
      regionId: {
        [Op.eq]: regionId,
      },
      ...queryBuilder.queryOptions.where,
    };
  }
  let allPosts = await Post.findAndCountAll(
    queryBuilder.queryOptions
  );
  allPosts = queryBuilder.createPagination(allPosts);

  res.json({
    status: "success",
    message: "Barcha pochtalar",
    error: null,
    data: {
      ...allPosts,
    },
  });
});

exports.getPostById = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const postById = await Post.findByPk(id);

  if (!postById) {
    return next(
      new AppError("Bunday Id li Pochta mavjud emas", 404)
    );
  }

  res.json({
    status: "success",
    message: "Post by ID",
    error: null,
    data: {
      postById,
    },
  });
});

exports.getPostByRegionId = catchAsync(
  async (req, res, next) => {
    const { id } = req.params;

    const postByRegion = await Post.findAll({
      where: {
        regionId: {
          [Op.eq]: id,
        },
      },
    });

    if (!postByRegion) {
      return next(
        new AppError("Bunday pochta mavjud emas", 404)
      );
    }

    res.json({
      status: "success",
      message: "Post by Courier Id",
      error: null,
      data: {
        postByRegion,
      },
    });
  }
);

exports.existRegions = catchAsync(
  async (req, res, next) => {
    const regionsArr = [];

    const ordersInRegions = await Order.findAll({
      where: {
        orderStatus: {
          [Op.eq]: orderStatuses.STATUS_ACCEPTED,
        },
      },
    });

    ordersInRegions.map(order => {
      let id;
      if (
        order.districtId === 101 ||
        order.districtId === 106
      ) {
        id = 6;
        if (!regionsArr.includes(id)) {
          regionsArr.push(id);
        }
      } else if (order.regionId === 1) {
        id = 13;
        if (!regionsArr.includes(id)) {
          regionsArr.push(id);
        }
      } else {
        id = order.regionId;
        if (!regionsArr.includes(id)) {
          regionsArr.push(id);
        }
      }
    });

    const regionsWeHave = await Region.findAll({
      where: {
        id: {
          [Op.in]: regionsArr,
        },
      },
    });

    return res.json({
      status: "success",
      message: "regions array",
      error: null,
      data: regionsWeHave,
    });
  }
);

exports.ordersBeforeSend = catchAsync(
  async (req, res, next) => {
    const { regionId } = req.params;
    const queryBuilder = new QueryBuilder(req.query);
    let allOrders = [];
    let ordersArrInPost = [];
    req.query.orderStatus = orderStatuses.STATUS_ACCEPTED;

    queryBuilder.queryOptions.include = [
      { model: Region, as: "region", attributes: ["name"] },
      {
        model: District,
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

    const region = await Region.findOne({
      attributes: ["id", "name"],
      where: {
        id: {
          [Op.eq]: regionId,
        },
      },
    });

    if (region.name === "Samarqand viloyati") {
      queryBuilder.queryOptions.where = {
        ...queryBuilder.queryOptions.where,
        regionId: {
          [Op.eq]: regionId,
        },
        districtId: {
          [Op.notIn]: [101, 106],
        },
      };
      allOrders = await Order.findAndCountAll(
        queryBuilder.queryOptions
      );
      allOrders = queryBuilder.createPagination(allOrders);
      ordersArrInPost = allOrders.content.map(order => {
        return order.dataValues.id;
      });
    } else if (region.name === "Navoiy viloyati") {
      queryBuilder.queryOptions.where = {
        ...queryBuilder.queryOptions.where,
        [Op.or]: {
          regionId: {
            [Op.eq]: regionId,
          },
          districtId: {
            [Op.in]: [101, 106],
          },
        },
      };
      allOrders = await Order.findAndCountAll(
        queryBuilder.queryOptions
      );
      allOrders = queryBuilder.createPagination(allOrders);
      ordersArrInPost = allOrders.content.map(order => {
        return order.dataValues.id;
      });
    } else if (region.name === "Xorazm viloyati") {
      queryBuilder.queryOptions.where = {
        ...queryBuilder.queryOptions.where,
        regionId: {
          [Op.in]: [1, regionId],
        },
      };
      allOrders = await Order.findAndCountAll(
        queryBuilder.queryOptions
      );
      allOrders = queryBuilder.createPagination(allOrders);
      ordersArrInPost = allOrders.content.map(order => {
        return order.dataValues.id;
      });
    } else {
      req.query.regionId = regionId;
      queryBuilder.filter();
      allOrders = await Order.findAndCountAll(
        queryBuilder.queryOptions
      );
      allOrders = queryBuilder.createPagination(allOrders);
      ordersArrInPost = allOrders.content.map(order => {
        return order.dataValues.id;
      });
    }

    res.json({
      status: "success",
      message: "Orders ready to sent",
      error: null,
      data: {
        ...allOrders,
        ordersArrInPost,
      },
    });
  }
);

exports.createPostForAllOrders = catchAsync(
  async (req, res, next) => {
    const { regionId, ordersArr } = req.body;

    let newPost = await Post.findOne({
      where: {
        regionId: {
          [Op.eq]: regionId,
        },
        postStatus: {
          [Op.eq]: postStatuses.POST_NEW,
        },
      },
    });

    if (!newPost) {
      newPost = await Post.create({
        regionId: regionId,
      });
    }

    await Order.update(
      {
        postId: newPost.id,
        orderStatus: orderStatuses.STATUS_DELIVERING,
        orderStatusUz: orderStatusesUz.STATUS_YULDA,
      },
      {
        where: {
          id: {
            [Op.in]: ordersArr,
          },
        },
      }
    );

    ordersArr.map(async id => {
      await Tracking.create({
        orderId: id,
        fromStatus: orderStatuses.STATUS_ACCEPTED,
        toStatus: orderStatuses.STATUS_DELIVERING,
      });
    });

    const orderArrSum = await Order.sum("totalPrice", {
      where: {
        id: {
          [Op.in]: ordersArr,
        },
      },
    });

    newPost.postTotalPrice += orderArrSum;
    await newPost.save();

    res.json({
      status: "success",
      message: "Pochta yaratildi",
      error: null,
      data: newPost.id,
    });
  }
);

exports.createPostForCustomOrders = catchAsync(
  async (req, res, next) => {
    const { postId, ordersArr } = req.body;
    const postByPk = await Post.findByPk(postId);
    const subtractingOrders = await Order.sum(
      "totalPrice",
      {
        where: {
          orderStatus: {
            [Op.eq]: orderStatuses.STATUS_DELIVERING,
          },
          id: {
            [Op.notIn]: ordersArr,
          },
          postId: {
            [Op.eq]: postId,
          },
        },
      }
    );

    postByPk.postTotalPrice -= subtractingOrders;
    await postByPk.save();

    const ordersNotInPost = await Order.update(
      {
        postId: null,
        orderStatus: orderStatuses.STATUS_ACCEPTED,
        orderStatusUz: orderStatusesUz.STATUS_ADMIN_OLDI,
      },
      {
        where: {
          orderStatus: {
            [Op.eq]: orderStatuses.STATUS_DELIVERING,
          },
          id: {
            [Op.notIn]: ordersArr,
          },
          postId: {
            [Op.eq]: postId,
          },
        },
      }
    );

    ordersNotInPost.map(async order => {
      await Tracking.create({
        orderId: order.id,
        fromStatus: orderStatuses.STATUS_DELIVERING,
        toStatus: orderStatuses.STATUS_ACCEPTED,
      });
    });

    if (ordersArr.length < 1) {
      await Post.destroy({
        where: {
          id: {
            [Op.eq]: postId,
          },
        },
      });

      return res.json({
        status: "success",
        message: "Ushbu pochta bekor qilindi",
        error: null,
        data: null,
      });
    }

    res.json({
      status: "success",
      message: "Tayyor pochta yaratildi",
      error: null,
      data: ordersNotInPost,
    });
  }
);

exports.getOrdersInPost = catchAsync(
  async (req, res, next) => {
    const { id } = req.params;
    const queryBuilder = new QueryBuilder(req.query);
    const currentPostStatus = await Post.findByPk(id, {
      attributes: ["postStatus"],
    });
    queryBuilder
      .filter()
      .paginate()
      .limitFields()
      .search(["recipientPhoneNumber", "recipient"])
      .sort();
    queryBuilder.queryOptions.where = {
      ...queryBuilder.queryOptions.where,
      postId: {
        [Op.eq]: id,
      },
    };

    queryBuilder.queryOptions.include = [
      {
        model: District,
        as: "district",
        attributes: ["name"],
      },
      { model: Region, as: "region", attributes: ["name"] },
    ];

    let ordersInPost = await Order.findAndCountAll(
      queryBuilder.queryOptions
    );

    ordersInPost =
      queryBuilder.createPagination(ordersInPost);

    const ordersArrInPost = ordersInPost.content.map(o => {
      return o.dataValues.id;
    });
    res.json({
      status: "success",
      message: "Orders in Post",
      error: null,
      data: {
        ...ordersInPost,
        ordersArrInPost,
        currentPostStatus,
      },
    });
  }
);

exports.newPosts = catchAsync(async (req, res, next) => {
  const notSentPosts = await Post.findAll({
    where: {
      postStatus: {
        [Op.eq]: postStatuses.POST_NEW,
      },
    },
  });

  res.json({
    status: "success",
    message: "Not sent posts",
    error: null,
    data: notSentPosts,
  });
});

exports.sendPost = catchAsync(async (req, res, next) => {
  const validationErrors = validationResult(req);
  if (!validationErrors.isEmpty()) {
    let err = new AppError("Validatsiya xatosi", 403);
    err.isOperational = false;
    err.errors = validationErrors;
    return next(err);
  }

  const { userRole } = req.user;
  const { id } = req.params;
  const { postStatus, name, phone, avtoNumber, comment } =
    req.body;
  const getPostById = await Post.findByPk(id);
  const note = `Ismi -${name}, Tel - ${phone}, Mashina raqami - ${avtoNumber}, Izoh - ${comment}`;
  if (!getPostById) {
    return next(new AppError("This post not found", 404));
  }
  if (
    userRole === userRoles.ADMIN &&
    postStatus === postStatuses.POST_DELIVERING
  ) {
    let postStatusUz;
    postStatus === postStatuses.POST_DELIVERING
      ? (postStatusUz = postStatusesUz.POCHTA_YULDA)
      : (postStatusUz = "YO`LDA");
    await getPostById.update({
      postStatus: postStatus,
      postStatusUz: postStatusUz,
      note: note,
    });
  }

  res.json({
    status: "success",
    message: "Pochta jo'natildi",
    error: null,
    data: {
      note,
    },
  });
});

exports.getTodaysPost = catchAsync(
  async (req, res, next) => {
    const { regionId } = req.user;
    const queryBuilder = new QueryBuilder(req.query);

    queryBuilder
      .filter()
      .limitFields()
      .paginate()
      .search(["recipientPhoneNumber", "recipient"])
      .sort();

    queryBuilder.queryOptions.include = [
      { model: Region, as: "region", attributes: ["name"] },
      {
        model: District,
        as: "district",
        attributes: ["name"],
      },
    ];

    const postOnTheWay = await Post.findOne({
      where: {
        regionId: {
          [Op.eq]: regionId,
        },
        postStatus: {
          [Op.eq]: postStatuses.POST_DELIVERING,
        },
      },
    });

    queryBuilder.queryOptions.where = {
      ...queryBuilder.queryOptions.where,
      postId: {
        [Op.eq]: postOnTheWay?.id,
      },
    };

    let ordersOnTheWay = await Order.findAndCountAll(
      queryBuilder.queryOptions
    );
    ordersOnTheWay =
      queryBuilder.createPagination(ordersOnTheWay);

    const orderArr = ordersOnTheWay.content.map(order => {
      return order?.id;
    });

    res.json({
      status: "success",
      message: "Yo'ldagi pochta",
      error: null,
      data: { ordersOnTheWay, orderArr, postOnTheWay },
    });
  }
);

exports.recievePost = catchAsync(async (req, res, next) => {
  const { postStatus, ordersArr, postId } = req.body;
  let postStatusUz;
  postStatus === postStatuses.POST_DELIVERED
    ? (postStatusUz = postStatusesUz.POCHTA_YETIB_BORDI)
    : (postStatusUz = postStatusesUz.POCHTA_YETIB_BORMADI);

  const postInfo = await Post.update(
    {
      postStatus: postStatus,
      postStatusUz: postStatusUz,
    },
    {
      where: {
        id: {
          [Op.eq]: postId,
        },
      },
    }
  );

  const ordersNotInArr = await Order.findAll({
    where: {
      id: {
        [Op.notIn]: ordersArr,
      },
      postId: {
        [Op.eq]: postId,
      },
    },
  });

  if (ordersNotInArr) {
    await Order.update(
      {
        orderStatus: orderStatuses.STATUS_NOT_DELIVERED,
        orderStatusUz: orderStatusesUz.STATUS_BORMADI,
      },
      {
        where: {
          id: {
            [Op.notIn]: ordersArr,
          },
          postId: {
            [Op.eq]: postId,
          },
        },
      }
    );

    ordersNotInArr.map(async order => {
      await Tracking.create({
        orderId: order.id,
        fromStatus: orderStatuses.STATUS_DELIVERING,
        toStatus: orderStatuses.STATUS_NOT_DELIVERED,
      });
    });

    // await Tracking.create({
    // 	orderId: {
    // 		[Op.notIn]: ordersArr,
    // 	},
    // 	fromStatus: orderStatuses.STATUS_DELIVERING,
    // 	toStatus: orderStatuses.STATUS_NOT_DELIVERED,
    // });
  }

  const updatedOrders = await Order.update(
    {
      orderStatus: orderStatuses.STATUS_DELIVERED,
      orderStatusUz: orderStatusesUz.STATUS_BORDI,
    },
    {
      where: {
        id: {
          [Op.in]: ordersArr,
        },
        postId: {
          [Op.eq]: postId,
        },
      },
    }
  );

  ordersArr.map(async id => {
    await Tracking.create({
      orderId: id,
      fromStatus: orderStatuses.STATUS_DELIVERING,
      toStatus: orderStatuses.STATUS_DELIVERED,
    });
  });

  if (ordersArr.length > 0) {
    await Post.update(
      {
        postStatus: postStatuses.POST_DELIVERED,
        postStatusUz: postStatusesUz.POCHTA_YETIB_BORDI,
      },
      {
        where: {
          id: {
            [Op.eq]: postId,
          },
        },
      }
    );
  } else {
    await Post.update(
      {
        postStatus: postStatuses.POST_NOT_DELIVERED,
        postStatusUz: postStatusesUz.POCHTA_YETIB_BORMADI,
      },
      {
        where: {
          id: {
            [Op.eq]: postId,
          },
        },
      }
    );
  }
  res.json({
    status: "sucess",
    message: "Buyurtmalar va pochtalar o'zgartirildi",
    error: null,
    data: {
      postInfo,
      ordersNotInArr,
      updatedOrders,
    },
  });
});

exports.getDeliveredPosts = catchAsync(
  async (req, res, next) => {
    const deliveredPosts = await Post.findAndCountAll({
      where: {
        postStatus: {
          [Op.eq]: postStatuses.POST_DELIVERED,
        },
      },
    });
    res.json({
      status: "success",
      message: "Delivered posts",
      error: null,
      data: {
        deliveredPosts,
      },
    });
  }
);
