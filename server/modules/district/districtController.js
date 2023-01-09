const District = require("./District");
const catchAsync = require("../../core/utils/catchAsync");
const AppError = require("../../core/utils/AppError");

exports.getAllDistricts = catchAsync(async (req, res, next) => {
	const allDistricts = await District.findAll();

	res.json({
		status: "success",
		message: "All districts",
		error: null,
		data: {
			allDistricts,
		},
	});
});

exports.getById = catchAsync(async (req, res, next) => {
	const { id } = req.params;
	const districtById = await District.findByPk(id);

	if (!districtById) {
		return next(new AppError("Bundat tuman mavjud emas", 404));
	} 

	res.json({
		status: "Success",
		message: "tuman id bo`yicha",
		error: null,
		data: null,
	});
});
