const { Op } = require("sequelize");
const User = require("../../modules/user/User");
const catchAsync = require("./catchAsync");
const userRole = require("../constants/userRole");
const Region = require("../../modules/region/Region");
const regionJson = require("../../modules/region/regions.json");
const districtJson = require("../../modules/district/districts.json");
const District = require("../../modules/district/District");

module.exports = catchAsync(async () => {
	const haveRegion = await Region.count();
	if (haveRegion === 0) {
		await Region.bulkCreate(regionJson);
	}

	const haveDistrict = await District.count();
	if (haveDistrict === 0) {
		await District.bulkCreate(districtJson);
	}
	const superAdminCount = await User.count({
		where: { userRole: { [Op.eq]: userRole.SUPER_ADMIN } },
	});
	if (superAdminCount === 0) {
		const superAdminInfo = {
			firstName: "Bekzod",
			lastName: "Ismatov",
			phoneNumber: "+998906479794",
			passportNumber: "AB4332323",
			username: "myusername",
			password: "19981998",
			userRole: "SUPER_ADMIN",
			userRoleUz: "RAHBAR"
		};
		const createdUser = await User.create(superAdminInfo);
	}
});
