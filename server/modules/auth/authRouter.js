const express = require("express")
const authController = require("./authController")
const {body} = require("express-validator")

const router = express.Router()

router
    .post("/login",
    body("username")
    .notEmpty()
    .withMessage("Login yoki parol xato")
    .isLength({min: 5})
    .withMessage("Login yoki parol xato")
    .trim()
    .isLowercase()
    .withMessage("Login yoki parol xato"),
    body("password")
    .notEmpty()
    .withMessage("Login yoki parol xato")
    .isLength({min: 6})
    .withMessage("Login yoki parol xato"),
    authController.login)

module.exports = router