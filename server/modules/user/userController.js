const User = require("./User");
const catchAsync = require("../../core/utils/catchAsync");
const AppError = require("../../core/utils/AppError");
const userRole = require("../../core/constants/userRole");
const userTariff = require("../../core/constants/userTariff");
const { validationResult } = require("express-validator");
const QueryBuilder = require("../../core/utils/QueryBuilder");
const { Op } = require("sequelize");
const { hash } = require("bcrypt");
const userRoleUz = require("../../core/constants/userRoleUz");

const findById = async (id, next) => {
  const byId = await User.findByPk(id, {
    attributes: { exclude: ["password"] },
  });
  if (byId) {
    return byId;
  }
  return null;
};

exports.getUsers = catchAsync(async (req, res, next) => {
  const { id } = req.user;
  const queryBuilder = new QueryBuilder(req.query);
  queryBuilder
    .filter()
    .paginate()
    .limitFields()
    .search([
      "phoneNumber",
      "firstName",
      "lastName",
      "storeName",
    ])
    .sort();

  // getting users except SUPER_ADMIN
  if (
    !req.query.userRole ||
    req.query.userRole === "SUPER_ADMIN"
  ) {
    queryBuilder.queryOptions.where.userRole = {
      [Op.ne]: "SUPER_ADMIN",
    };
    queryBuilder.queryOptions.where.id = { [Op.ne]: id };
  }

  if (queryBuilder.queryOptions.attributes) {
    queryBuilder.queryOptions.attributes =
      queryBuilder.queryOptions.attributes.filter(
        a => a !== "password"
      );
  } else {
    queryBuilder.queryOptions.attributes = {
      exclude: ["password"],
    };
  }

  // get and count all users
  let allUsers = await User.findAndCountAll(
    queryBuilder.queryOptions
  );

  if (!allUsers) {
    return next(
      new AppError("Foydalanuvchilar mavjud emas", 404)
    );
  }
  allUsers = queryBuilder.createPagination(allUsers);
  res.json({
    status: "success",
    message: "Barcha foydalanuvchilar",
    error: null,
    data: {
      ...allUsers,
    },
  });
});

exports.getById = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const userById = await findById(id);
  if (!userById) {
    return next(
      new AppError(`Bunday foydalanuvchi topilmadi`)
    );
  }
  res.json({
    status: "success",
    message: `Foydalanuvchi ${userById.firstName}`,
    error: null,
    data: {
      userById,
    },
  });
});

exports.createUsers = catchAsync(async (req, res, next) => {
  const validationErrors = validationResult(req);
  if (!validationErrors.isEmpty()) {
    const err = new AppError("Validatsiya xatosi", 400);
    err.isOperational = false;
    err.errors = validationErrors;
    return next(err);
  }
  if (req.body.userRole === userRole.SUPER_ADMIN) {
    return next(
      new AppError(
        "Faqat bitta Super admin ro'yxatdan o'tishi mumkin"
      )
    );
  }
  const newUser = await User.create(req.body);
  res.json({
    status: "success",
    message: "Yangi foydalanuvchi yaratildi",
    error: null,
    data: null,
  });
});
exports.updateUsers = catchAsync(async (req, res, next) => {
  const validationErrors = validationResult(req);
  if (!validationErrors.isEmpty()) {
    const err = new AppError("Validatsiya xatosi", 400);
    err.isOperational = false;
    err.errors = validationErrors;
    return next(err);
  }
  const { id } = req.params;
  const userById = await findById(id);
  if (!userById) {
    return next(
      new AppError(`Bunday foydalanuvchi topilmadi`)
    );
  }
  let updateUser;
  if (!req.body.password) {
    updateUser = await userById.update(req.body);
  }
  if (req.body.userRole === userRole.SUPER_ADMIN) {
    return next(
      new AppError(
        "Faqat bitta Super admin ro'yxatdan o'tishi mumkin"
      )
    );
  }
  res.json({
    status: "success",
    message: "Foydalanuvchi ma'lumotlari yangilandi",
    error: null,
    data: {
      updateUser,
    },
  });
});

exports.getUserRole = catchAsync(async (req, res, next) => {
  let roles = [];
  const rolesUz = Object.values(userRoleUz).slice(1);
  const rolesEn = Object.values(userRole).slice(1);
  rolesEn?.forEach((_, i) => {
    roles.push({
      id: i + 1,
      uz: rolesUz[i],
      en: rolesEn[i],
    });
  });
  res.status(200).json({
    status: "success",
    message: "Barcha foydalanuvchi rollari",
    error: null,
    data: {
      roles,
    },
  });
});

exports.getTariff = catchAsync(async (req, res, next) => {
  const tariffs = Object.values(userTariff);
  res.status(200).json({
    status: "success",
    message: "Barcha tariflar",
    error: null,
    data: {
      tariffs,
    },
  });
});

exports.updateStatus = catchAsync(
  async (req, res, next) => {
    const { id } = req.params;
    const { status } = req.body;
    const userById = await findById(id);
    if (!userById) {
      return next(
        new AppError(`Bunday foydalanuvchi topilmadi`)
      );
    }
    const updateUserStatus = await userById.update({
      status,
    });
    res.status(203).json({
      status: "success",
      message: "Foydalanuvchi statusi o'zgardi",
      error: null,
      data: updateUserStatus,
    });
  }
);
exports.updatePassword = catchAsync(
  async (req, res, next) => {
    const validationErrors = validationResult(req);
    if (!validationErrors.isEmpty()) {
      const err = new AppError("Validatsiya xatosi", 400);
      err.isOperational = false;
      err.errors = validationErrors;
      return next(err);
    }
    const { id } = req.user;
    const byIdUser = await User.findByPk(id);
    if (!byIdUser) {
      return next(
        new AppError(`Bunday foydalanuvchi topilmadi`)
      );
    }
    if (id === +req.params.id) {
      if (byIdUser.username === req.body.username) {
        const newPassword = await hash(
          req.body.password,
          8
        );
        await byIdUser.update({ password: newPassword });
      } else {
        return next(new AppError("Login xato kiritildi"));
      }
    } else {
      return next(
        new AppError(
          "Siz bu foydalanuvchi parolini o'zgartira olmaysiz",
          400
        )
      );
    }
    res.status(203).json({
      status: "success",
      message: "Foydalanuvchi paroli o'zgartirildi",
      error: null,
      data: null,
    });
  }
);
