const { body } = require("express-validator");
const userRole = require("../../core/constants/userRole")
const userRoleUz = require("../../core/constants/userRoleUz")
const User = require("./User");
const {Op} = require("sequelize")
exports.createValidator = [
	body("userRole")
    .custom(async(value, {req}) => {
		value === userRole.STORE_OWNER? req.body.userRoleUz = userRoleUz.FIRMA: null 
		value === userRole.ADMIN? req.body.userRoleUz = userRoleUz.ADMIN: null 
		value === userRole.COURIER? req.body.userRoleUz = userRoleUz.KURIER: null 
      if(value === "Foydalanuvchi mansabi" || value === "" || value === undefined){
        throw new Error("Foydalanuvchi mansabi kiritilmadi")
      }
    }),
	body("firstName")
		.notEmpty()
		.withMessage("Ism bo'sh bo'lishi mumkin emas"),
	body("lastName")
		.notEmpty()
		.withMessage("Familiya bo'sh bo'lishi mumkin emas"),
	body("username")
		.notEmpty()
		.withMessage("Login bo'sh bo'lishi mumkin emas")
		.isLength({ min: 5 })
		.withMessage("Login 5 ta belgidan kam bo'lmasligi kerak")
		.trim()
		.isLowercase()
		.withMessage("Login faqat kichkina harflardan iborat bo'lishi kerak")
		.custom(async(value) => {
			const existedUser = await User.findOne({where: {username:{[Op.eq]: value}}}) 
			if(existedUser) 
			throw new Error("Ushbu login tizimda mavjud, iltimos boshqa login o'ylab toping")
		}),
	body("password")
		.notEmpty()
		.withMessage("Parol bo'sh bo'lishi mumkin emas")
		.isLength({ min: 6 })
		.withMessage("Parol 6 ta belgidan kam bo'lmasligi kerak"),
	body("passportNumber")
		.notEmpty()
		.withMessage("Pasport raqami bo'sh bo'lishi mumkin emas")
		.matches(/^[A-Z]{2}[0-9]{7}$/)
		.withMessage("Passport raqami xato kiritildi"),
	body("phoneNumber")
		.notEmpty()
		.withMessage("Telefon raqam bo'sh bo'lishi mumkin emas")
		.matches(/^[+]998[0-9]{9}$/)
		.withMessage("Telefon raqam xato kiritildi"),
	body("regionId")
		.custom(async(value, {req}) => {
			if(req.body.userRole === "COURIER") {
				if(value === undefined || value === "Viloyatlar") {
					throw new Error("Viloyat tanlanmadi")
				}
			} 
		}),
	body("storeName")
		.custom(async(value, {req}) => {
		  if(req.body.userRole === "STORE_OWNER") {
			if(value === undefined || value.trim() === "") {
			  throw new Error("Do'kon nomi kiritilmadi")
			}
		  } 
		}),
	body("tariff")
		.custom(async(value, {req}) => {
			if(req.body.userRole === "COURIER") {
				if(value === undefined || value.trim() === "") {
					throw new Error("Tarif tanlanmadi")
				}
			} 
		}),
];

exports.updateValidator = [
	body("userRole")
    .custom(async(value, {req}) => {
		value === userRole.STORE_OWNER? req.body.userRoleUz = userRoleUz.FIRMA: null 
		value === userRole.ADMIN? req.body.userRoleUz = userRoleUz.ADMIN: null 
		value === userRole.COURIER? req.body.userRoleUz = userRoleUz.KURIER: null 
      if(value === "Foydalanuvchi mansabi" || value === "" || value === undefined){
        throw new Error("Foydalanuvchi mansabi kiritilmadi")
      }
    }),
	body("firstName")
		.notEmpty()
		.withMessage("Ism bo'sh bo'lishi mumkin emas"),
	body("lastName")
		.notEmpty()
		.withMessage("Familiya bo'sh bo'lishi mumkin emas"),
	body("username")
		.notEmpty()
		.withMessage("Login bo'sh bo'lishi mumkin emas")
		.isLength({ min: 5 })
		.withMessage("Login 5 ta belgidan kam bo'lmasligi kerak")
		.trim()
		.isLowercase()
		.withMessage("Login faqat kichkina harflardan iborat bo'lishi kerak"),
	body("passportNumber")
		.notEmpty()
		.withMessage("Pasport raqami bo'sh bo'lishi mumkin emas")
		.matches(/^[A-Z]{2}[0-9]{7}$/)
		.withMessage("Passport raqami xato kiritildi"),
	body("phoneNumber")
		.notEmpty()
		.withMessage("Telefon raqam bo'sh bo'lishi mumkin emas")
		.matches(/^[+]998[0-9]{9}$/)
		.withMessage("Telefon raqam xato kiritildi"),
	body("regionId")
		.custom(async(value, {req}) => {
			if(req.body.userRole === "COURIER") {
				if(value === undefined || value === "Viloyatlar") {
					throw new Error("Viloyat tanlanmadi")
				}
			} 
		}),
	body("storeName")
    	.custom(async(value, {req}) => {
      		if(req.body.userRole === "STORE_OWNER") {
        		if(value === undefined || value.trim() === "") {
          		throw new Error("Do'kon nomi kiritilmadi")
        	}
      	} 
    	}),
	body("tariff")
		.custom(async(value, {req}) => {
			if(req.body.userRole === "COURIER") {
				if(value === undefined || value.trim() === "") {
					throw new Error("Tarif tanlanmadi")
				}
			} 
		}),
];

exports.passwordChangeValidator = [
	body("username")
		.notEmpty()
		.withMessage("Login bo'sh bo'lishi mumkin emas")
		.isLength({ min: 5 })
		.withMessage("Login 5 ta belgidan kam bo'lmasligi kerak")
		.trim()
		.isLowercase()
		.withMessage("Login faqat kichkina harflardan iborat bo'lishi kerak"),
	body("password")
		.notEmpty()
		.withMessage("Parol bo'sh bo'lishi mumkin emas")
		.isLength({ min: 6 })
		.withMessage("Parol 6 ta belgidan kam bo'lmasligi kerak"),
]

