const { compare } = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../user/User");
const Region = require("../region/Region");
const AppError = require("../../core/utils/AppError");
const catchAsync = require("../../core/utils/catchAsync");
const { Op } = require("sequelize");

const generateToken = (payload, jwtSecret, options) => {
	return new Promise((resolve, reject) => {
		jwt.sign(payload, jwtSecret, options, (err, token) => {
			if (err) {
				reject(err);
			} else {
				resolve(token);
			}
		});
	});
};

const findByUsername = username => {
  const user = User.findOne({
    where: { username: { [Op.eq]: username } },
  });
  if (user) {
    return user;
  }
  return null;
};

exports.login = catchAsync(async (req, res, next) => {
	const { username, password } = req.body;
	const candidate = await findByUsername(username);
	if (!candidate) {
		return next(new AppError("Login yoki parol xato", 400));
	}
	const region = await Region.findOne({
		where: {
			id: { [Op.eq]: candidate.regionId },
		},
	});
	const passwordIsMatch = await compare(password, candidate.password);
	if (!passwordIsMatch) {
		return next(new AppError("Login yoki parol xato", 400));
	}
	if (candidate.status === "BLOCKED") {
		return next(new AppError("Foydalanuvchi bloklangan"));
	}
	const payload = {
		id: candidate.id,
		firstName: candidate.firstName,
		lastName: candidate.lastName,
		phoneNumber: candidate.phoneNumber,
		passportNumber: candidate.passportNumber,
		userRole: candidate.userRole,
		userRoleUz: candidate.userRoleUz,
		status: candidate.status,
		storeName: candidate.storeName,
		regionId: candidate.regionId,
		tariff: candidate.tariff,
		regionName: region?.name,
	};
	const token = await generateToken(payload, process.env.JWT_SECRET, {
		algorithm: "HS512",
		expiresIn: "30d",
	});
	res.json({
		status: "success",
		message: "Tizimga muvaffaqiyatli kirildi",
		error: null,
		data: {
			user: {
				...payload,
			},
			jwt: token,
		},
	});
});
