const { body} = require("express-validator");

exports.creatingOrderValidator = [
  body("orders.*.recipient")
    .trim()
    .notEmpty()
    .withMessage("Buyurtma egasi bo'sh bo'lishi mumkin emas"),
  body("orders.*.regionId")
    .notEmpty()
    .withMessage("Viloyat tanlanmadi"),
  body("orders.*.districtId")
    .notEmpty()
    .withMessage("Tuman tanlanmadi"),
  body("orders.*.recipientPhoneNumber")
    .notEmpty()
    .withMessage("Telefon raqam bo'sh bo'lishi mumkin emas")
    .matches(/^[+]998[0-9]{9}$/)
    .withMessage("Telefon raqam xato kiritildi"), 
  body("orders.*.orderItems.*.productName")
    .trim()
    .notEmpty()
    .withMessage("Tovar nomi bo'sh bo'lishi mumkin emas"),
  body("orders.*.orderItems.*.quantity")
    .notEmpty()
    .withMessage("Tovar miqdori bo'sh bo'lishi mumkin emas")
    .isInt({min: 1, max: 1000})
    .withMessage("Tovar soni kamida 1 tadan ko`pi bilan 1 ming ta bo`lishi kerak"),
  body("orders.*.orderItems.*.price")
    .notEmpty()
    .withMessage("Tovar miqdori bo'sh bo'lishi mumkin emas")
    .isInt({min: 0, max: 50000000})
    .withMessage("Tovar qiymati kamida 0 so`m dan ko`pi bilan 50 mln so`mgacha bo`lishi kerak"),
    
];

exports.updatedOrderValidator = [
  body("recipient")
    .trim()
    .notEmpty()
    .withMessage("Buyurtma egasi bo'sh bo'lishi mumkin emas"),
  body("orders.*.regionId")
    .notEmpty()
    .withMessage("Viloyat tanlanmadi"),
  body("orders.*.districtId")
    .notEmpty()
    .withMessage("Tuman tanlanmadi"),
  body("recipientPhoneNumber")
    .notEmpty()
    .withMessage("telefon raqam bo'sh bo'lishi mumkin emas")
    .matches(/^[+]998[0-9]{9}$/)
    .withMessage("telefon raqam xato kiritildi"), 
  body("orderItems.*.productName")
    .trim()
    .notEmpty()
    .withMessage("Tovar nomi bo'sh bo'lishi mumkin emas"),
  body("orderItems.*.quantity")
    .notEmpty()
    .withMessage("Tovar miqdori bo'sh bo'lishi mumkin emas")
    .isInt({min: 1, max: 1000})
    .withMessage("Tovar soni kamida 1 tadan ko`pi bilan 1 ming ta bo`lishi kerak"),
  body("orderItems.*.price")
    .notEmpty()
    .withMessage("Tovar miqdori bo'sh bo'lishi mumkin emas")
    .isInt({min: 0, max: 50000000})
    .withMessage("Tovar qiymati kamida 0 dan ko`pi bilan 50 mln gacha bo`lishi kerak"),
];