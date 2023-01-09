const { body } = require("express-validator");

exports.noteValidator = [
  body("name")
    .notEmpty()
    .withMessage("Xaydovchi ismi bo`sh bo`lmasligi kerak"),
  body("phone")
    .notEmpty()
    .withMessage("Telefon raqam bo'sh bo'lishi mumkin emas")
    .matches(/^[+]998[0-9]{9}$/)
    .withMessage("Telefon raqam xato kiritildi"),
  body("avtoNumber")
    .notEmpty()
    .withMessage("Moshina raqami bo`sh bo`lmasligi kerak"),
];
