const telegramBot = require("node-telegram-bot-api");
const TOKEN = process.env.TOKEN;
const bot = new telegramBot(TOKEN, {polling: {interval: 1000}})
const Order = require("../../modules/order/Order");
const regions = require("../../modules/region/regions.json");
const districts = require("../../modules/district/districts.json");
const User = require("../../modules/user/User");
const { Op } = require("sequelize");
const { compare } = require("bcrypt");
const OrderItem = require("../../modules/orderitem/OrderItem");
const Package = require("../../modules/package/Package");
const orderStatuses = require("../constants/orderStatus");
const postStatuses = require("../constants/postStatus");
const Post = require("../../modules/post/Post");

const botTelegram = async (req, res, next) => {
  // let regionArr = []

  // regions?.forEach(region=>{
  //     regionArr.push([region.name, region.id])
  // })
  
  // let regionName = []
  // regionArr.forEach(reg=>{
  //     regionName.push(reg.slice(0,1))
  // })
  // regionName.push(["⬅️ Orqaga"])

  // let districtArr = []

  // districts?.forEach(districts=>{
  //     districtArr.push([districts.name, districts.regionId, districts.id])
  // })
  // let selectedDistricts = []

  // let candidate = []
  // let checkPassword = false
  // let lock = false
  // let lock2 = false
  // let lock3 = false

  bot.onText(/\/start/, async message => {
    const option = {
      parse_mode: "Markdown",
      reply_markup: {
        one_time_keyboard: true,
        keyboard: [
          [
            {
              text: "My phone number",
              request_contact: true,
            },
          ],
        ],
      },
    };
    bot.sendMessage(
      message.chat.id,
      "InterEx pochta tizimi botiga xush kelibsiz.Telefon raqamingizni yuboring",
      option
    );
    bot.once("message", async message => {
      let phoneNumber
      message.contact ? phoneNumber = `+${message.contact.phone_number}` : "";
      const candidateUser = await User.findOne({
        where: {
          phoneNumber: {
            [Op.eq]: phoneNumber,
          },
        },
      });
      if (candidateUser) {
        await candidateUser.update({
          chatId: message.chat.id,
        });
      }
    });
  });
  bot.onText(/\/yangi_buyurtmalar/, async message => {
    let lock = false;
    const candidate = await User.findOne({
      where: {
        chatId: {
          [Op.eq]: message.chat.id,
        },
      },
    });
    let allPosts
    candidate ?  allPosts = await Post.findAll({
      where: {
        regionId: {
          [Op.eq]: candidate.regionId,
        },
      },
      attributes: [
        "id",
        "note",
        "postTotalPrice",
        "postStatus",
      ],
    }): "";
    let allPostStatus
    allPosts ? allPostStatus = allPosts.filter(
      e => e.postStatus === postStatuses.POST_DELIVERING
    ): "";
    let a 
    allPostStatus ? a = JSON.stringify(allPostStatus)
      .replaceAll(",", "\n")
      .replaceAll("{", "\n")
      .replaceAll("[", "")
      .replaceAll("]", "")
      .replaceAll("}", "")
      .replaceAll("postTotalPrice", "Pochta narxi")
      .replaceAll("postStatus", "Pochta holati")
      .replaceAll("DELIVERING", "Yo'lda")
      .replaceAll('"', ""): "";
    if (!lock && allPostStatus) {
      lock = true;
      if (allPostStatus.length === 0) {
        bot.sendMessage(
          message.chat.id,
          "Sizga yangi jo'natma yo'q"
        );
      } else {
        bot
          .sendMessage(
            message.chat.id,
            "Sizga yangi junatma bor"
          )
          .then(() => {
            bot.sendMessage(message.chat.id, `${a}`);
          });
      }
    }
  });

  //     bot.sendMessage(message.chat.id, "Express pochta bot ga xush kelibsiz. Iltimos loginingizni kiriting")
  //     bot.on("message", async(message) => {
  //         const candidateUser = await User.findOne({where: {username: {[Op.eq]: message.text}}})
  //         if(!candidateUser && candidate.length === 0) {
  //             bot.sendMessage(message.chat.id, "Login yoki parol xato")
  //         }
  //         if(candidateUser) {
  //             if(!lock) {
  //             lock = true
  //             bot.sendMessage(message.chat.id, "Parolingizni kiriting")
  //             bot.on("message", async(message) => {
  //                 lock = false
  //                 checkPassword = await compare(message.text, candidateUser.dataValues.password)
  //                 if(checkPassword == true) {
  //                 if(candidateUser.dataValues.userRole === "STORE_OWNER"
  //                     || candidateUser.dataValues.userRole === "COURIER") {
  //                     await candidate.push(candidateUser.dataValues);
  //                 }
  //                 if(candidate.length === 0) {
  //                     bot.sendMessage(message.chat.id, "Ushbu foydalanuvchiga ruxsat yo'q")
  //                 }
  //                 if(candidate.length > 0) {
  //                     const option = {
  //                         "reply_markup": {
  //                             "inline_keyboard": [
  //                                 [
  //                                 {
  //                                     text: "Ha",
  //                                     callback_data: "Ha"
  //                                 },
  //                                 {
  //                                     text: "Yo'q",
  //                                     callback_data: "Yo'q"
  //                                 }
  //                                 ]
  //                                 ]
  //                                 }
  //                             }
  //                     bot.sendMessage(message.chat.id, "Yangi buyurtma qo'shmoqchimisiz?", option)
  //                     bot.on("callback_query", async(callbackQuery) => {
  //                         const message = callbackQuery.message
  //                         bot.answerCallbackQuery(callbackQuery.id).then(() => {
  //                         if(callbackQuery.data === "Yo'q") {
  //                             bot.sendMessage(message.chat.id, "E'tiboringiz uchun rahmat")
  //                         }
  //                         if(callbackQuery.data === "Ha") {
  //                             bot.sendMessage(message.chat.id, "Buyurtmachi ismini kiriting")
  //                             bot.once("message", async(message) => {
  //                                 recipient = message.text
  //                                 bot.sendMessage(message.chat.id, "Buyurtmachi telefon raqamini kiriting")
  //                                 bot.once("message", async(message)=>{
  //                                     recipientPhoneNumber = message.text
  //                                     bot.sendMessage(message.chat.id, "Izoh yozing")
  //                                     bot.once("message", async(message)=> {
  //                                         note = message.text
  //                                         storeOwnerId = candidateUser.id
  //                                         const option = {
  //                                             "parse_mode": "Markdown",
  //                                             "reply_markup": {
  //                                                 "one_time_keyboard": true,
  //                                                 "keyboard": regionName
  //                                                 }
  //                                             }
  //                                         bot.sendMessage(message.chat.id, "Viloyatingizni tanlang", option)
  //                                         bot.once("message", async(message) => {
  //                                             selectedDistricts = []
  //                                             regionArr.forEach(region=>{
  //                                                 if(region[0] === message.text) {
  //                                                     regionId = region[1]
  //                                                     districtArr.forEach(district=>{
  //                                                         if(region[1] === district[1]) {
  //                                                             selectedDistricts.push(new Array(district[0]))
  //                                                         }
  //                                                     })
  //                                                 }
  //                                             })
  //                                             selectedDistricts.push(["⬅️ Orqaga"])
  //                                             const option = {
  //                                                 "parse_mode": "Markdown",
  //                                                 "reply_markup": {
  //                                                     "one_time_keyboard": true,
  //                                                     "keyboard": selectedDistricts
  //                                                 }
  //                                             }
  //                                             bot.sendMessage(message.chat.id, "Tumaningizni tanlang", option)
  //                                             bot.once("message", async(message) => {
  //                                                 const option = {
  //                                                     "reply_markup": {
  //                                                         "inline_keyboard": [
  //                                                             [
  //                                                                 {
  //                                                                     text: "Ha",
  //                                                                     callback_data: "Ha2"
  //                                                                 },
  //                                                                 {
  //                                                                     text: "Yo'q",
  //                                                                     callback_data: "Yo'q"
  //                                                                 }
  //                                                             ]
  //                                                         ]
  //                                                         }
  //                                                     }
  //                                                 districtArr.forEach(district=>{
  //                                                     if(district[0] === message.text) {
  //                                                         districtId = district[2]
  //                                                     }
  //                                                 })
  //                                                 bot.sendMessage(message.chat.id, "Nimadir buyurtma qilasizmi?", option)
  //                                                 bot.on("callback_query", async(callbackQuery) => {
  //                                                     const message = callbackQuery.message
  //                                                     bot.answerCallbackQuery(callbackQuery.id).then(async() => {
  //                                                     if(callbackQuery.data === "Yo'q2") {
  //                                                         if(!lock3) {
  //                                                             lock3 = true
  //                                                             const option = {
  //                                                                 "reply_markup": {
  //                                                                     "inline_keyboard": [
  //                                                                         [
  //                                                                             {
  //                                                                                 text: "Ha",
  //                                                                                 callback_data: "Ha"
  //                                                                             },
  //                                                                             {
  //                                                                                 text: "Yo'q",
  //                                                                                 callback_data: "Yo'q"
  //                                                                             }
  //                                                                         ]
  //                                                                     ]
  //                                                                     }
  //                                                                 }
  //                                                                 bot.sendMessage(message.chat.id, "Yana yangi buyurtmachi qo'shmoqchimisiz", option)
  //                                                             }
  //                                                         }
  //                                                         if(callbackQuery.data === "Ha2") {
  //                                                         if(!lock2) {
  //                                                             lock2 = true
  //                                                         bot.sendMessage(message.chat.id, "Buyurtma nomini kiriting")
  //                                                         const newPackage = await Package.create({storeOwnerId})
  //                                                         packageId = newPackage.id
  //                                                         const newOrder = await Order.create({recipient, recipientPhoneNumber, note, storeOwnerId, regionId, districtId, packageId})
  //                                                         bot.once("message", (message) => {
  //                                                             productName = message.text
  //                                                             bot.sendMessage(message.chat.id, "Buyurtma sonini kiriting")
  //                                                             bot.once("message", async(message) => {
  //                                                                 quantityOrder = Number(message.text)
  //                                                                 if(isNaN(quantityOrder)) {
  //                                                                     quantity = null
  //                                                                 }
  //                                                                 else if(!isNaN(quantityOrder)) {
  //                                                                     quantity = message.text
  //                                                                 }
  //                                                                 bot.sendMessage(message.chat.id, "Buyurtma narxini kiriting")
  //                                                                 bot.once("message", catchAsync(async(message) => {
  //                                                                     priceOrder = Number(message.text)
  //                                                                     if(isNaN(priceOrder)){
  //                                                                         price = null
  //                                                                     }
  //                                                                     else if(!isNaN(quantityOrder)) {
  //                                                                         price = message.text
  //                                                                     }
  //                                                                     orderId = newOrder.id
  //                                                                     if(quantity !== null && price !== null) {
  //                                                                         await OrderItem.create({productName, quantity, price, orderId})
  //                                                                     }
  //                                                                     const option = {
  //                                                                         "reply_markup": {
  //                                                                             "inline_keyboard": [
  //                                                                                 [
  //                                                                                     {
  //                                                                                         text: "Ha",
  //                                                                                         callback_data: "Ha2"
  //                                                                                     },
  //                                                                                     {
  //                                                                                         text: "Yo'q",
  //                                                                                         callback_data: "Yo'q2"
  //                                                                                     }
  //                                                                                 ]
  //                                                                             ]
  //                                                                             }
  //                                                                         }
  //                                                                     bot.sendMessage(message.chat.id, "Yana nimadir buyurtma qilasizmi?", option)
  //                                                                     lock2 = false
  //                                                                 }))
  //                                                             })
  //                                                         })
  //                                                         }
  //                                                     }
  //                                                     })
  //                                                 lock3 = false
  //                                                 })
  //                                             })
  //                                         })
  //                                     })
  //                                 })
  //                             })
  //                         }
  //                         })
  //                     })
  //                 }
  //                 }
  //             })
  //         }
  //     }
  // })
};
module.exports = botTelegram;
