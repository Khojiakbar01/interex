const catchAsync = require("../../core/utils/catchAsync");
const { Op } = require("sequelize");
const QueryBuilder = require("../../core/utils/QueryBuilder");
const PackageModel = require("./Package");
const Order = require("../order/Order");
const UserModel = require("../user/User");
const DistrictModel = require("../district/District");
const RegionModel = require("../region/Region");
const statusPackages = require("../../core/constants/packageStatus");
const OrderItem = require("../orderitem/OrderItem");
const statusOrder = require("../../core/constants/orderStatus");
const {
  Table,
  TableRow,
  TableCell,
  WidthType,
  Paragraph,
  TextRun,
  Document,
  TabStopPosition,
  TabStopType,
  Packer,
  SectionType,
  AlignmentType,
  VerticalAlign,
  Style,
  PageOrientation,
} = require("docx");

exports.getAllPackages = catchAsync(
  async (req, res, next) => {
    const userId = req.user.id;
    const queryBuilder = new QueryBuilder(req.query);
    queryBuilder.filter().paginate().limitFields().sort();
    if (req.user.userRole === "STORE_OWNER") {
      if (req.query.new === "new") {
        queryBuilder.queryOptions.where = {
          packageStatus: {
            [Op.eq]: statusPackages.STATUS_NEW,
          },
          storeOwnerId: { [Op.eq]: userId },
          // ...queryBuilder.queryOptions.where
        };
      } else {
        queryBuilder.queryOptions.where = {
          storeOwnerId: { [Op.eq]: userId },
          // ...queryBuilder.queryOptions.where
        };
      }
    } else {
      if (req.query.new === "new") {
        queryBuilder.queryOptions.where = {
          packageStatus: {
            [Op.eq]: statusPackages.STATUS_NEW,
          },
        };
      }
    }
    queryBuilder.queryOptions.include = {
      model: UserModel,
      as: "storeOwner",
      attributes: ["firstName", "lastName", "storeName"],
    };
    let allPackages = await PackageModel.findAndCountAll(
      queryBuilder.queryOptions
    );

    allPackages =
      queryBuilder.createPagination(allPackages);

    res.status(200).json({
      status: "success",
      message: "Barcha paketlar ro`yhati",
      errors: null,
      data: {
        ...allPackages,
      },
    });
  }
);

exports.getOrdersByPackage = catchAsync(
  async (req, res, next) => {
    const { id } = req.params;
    req.query.packageId = id;
    const queryBuilder = new QueryBuilder(req.query);
    queryBuilder
      .paginate()
      .limitFields()
      .sort()
      .filter()
      .search(["recipient", "recipientPhoneNumber"]);

    queryBuilder.queryOptions.include = [
      {
        model: UserModel,
        as: "storeOwner",
        attributes: ["storeName"],
      },
      {
        model: DistrictModel,
        as: "district",
        attributes: ["name"],
      },
      {
        model: RegionModel,
        as: "region",
        attributes: ["name"],
      },
    ];

    let ordersbyPackage = await Order.findAndCountAll(
      queryBuilder.queryOptions
    );
    ordersbyPackage =
      queryBuilder.createPagination(ordersbyPackage);
    res.status(200).json({
      status: "success",
      message: "id bo`yicha package ma`lumotlari",
      errors: null,
      data: {
        ...ordersbyPackage,
      },
    });
  }
);
exports.downloadWord = catchAsync(
  async (req, res, next) => {
    const { userRole } = req.user;
    const { id } = req.params;
    let whereOrderStatus;
    const orderInclude = {
      include: [
        { model: UserModel, as: "storeOwner" },
        { model: RegionModel, as: "region" },
        { model: DistrictModel, as: "district" },
        { model: OrderItem, as: "items" },
      ],
    };
    if (userRole === "ADMIN") {
      whereOrderStatus = {
        orderStatus: {
          [Op.eq]: statusOrder.STATUS_ACCEPTED,
        },
      };
    } else {
      whereOrderStatus = {
        orderStatus: {
          [Op.eq]: statusOrder.STATUS_NEW,
        },
      };
    }
    let allNewOrdersbyPackage = await Order.findAll({
      ...orderInclude,
      where: {
        [Op.and]: [
          { packageId: { [Op.eq]: id } },
          {
            ...whereOrderStatus,
          },
        ],
      },
    });

    let ordersArr = [];
    for (
      let i = 0;
      i < allNewOrdersbyPackage.length;
      i + 2
    ) {
      let thereArr = allNewOrdersbyPackage.splice(i, 2);
      if (thereArr.length % 2 === 1) {
        thereArr.push({});
      }
      ordersArr.push(thereArr);
    }

    let children = [];
    ordersArr?.forEach(orderArr => {
      const table = new Table({
        width: { size: 12000, type: WidthType.DXA },
        rows: [
          new TableRow({
            cantSplit: true,
            children: [
              new TableCell({
                width: {
                  size: 5000,
                  type: WidthType.DXA,
                },
                children: [
                  new Paragraph({ children: [] }),
                  new Paragraph({
                    alignment: AlignmentType.CENTER,
                    children: [
                      new TextRun({
                        text: `${
                          new Intl.DateTimeFormat("RU-RU", {
                            dateStyle: "short",
                            timeStyle: "short",
                          }).format(
                            orderArr[0].createdAt
                          ) || null
                        }`,
                        bold: true,
                      }),
                    ],
                  }),
                  new Paragraph({
                    alignment: AlignmentType.CENTER,
                    children: [
                      new TextRun("Firma: - "),
                      new TextRun("   "),
                      new TextRun({
                        text: `${
                          orderArr[0].storeOwner
                            .storeName || null
                        }`,
                        bold: true,
                      }),
                    ],
                  }),
                  new Paragraph({
                    alignment: AlignmentType.CENTER,
                    children: [
                      new TextRun({
                        text: "ID: -",
                      }),
                      new TextRun("   "),
                      new TextRun({
                        text: `${orderArr[0].id || null}`,
                        bold: true,
                      }),
                    ],
                  }),
                  new Paragraph({
                    alignment: AlignmentType.CENTER,
                    children: [
                      new TextRun({
                        text: "Viloyat: -",
                      }),
                      new TextRun("   "),
                      new TextRun({
                        text: `${
                          orderArr[0].region?.name || null
                        }`,
                        bold: true,
                      }),
                    ],
                  }),
                  new Paragraph({
                    alignment: AlignmentType.CENTER,
                    children: [
                      new TextRun({
                        text: "Tumani: -",
                      }),
                      new TextRun("   "),
                      new TextRun({
                        text: `${
                          orderArr[0].district?.name || null
                        }`,
                        bold: true,
                      }),
                    ],
                  }),
                  new Paragraph({
                    alignment: AlignmentType.CENTER,
                    children: [
                      new TextRun({
                        text: "Xaridor: -",
                      }),
                      new TextRun("   "),
                      new TextRun({
                        text: `${
                          orderArr[0].recipient || null
                        }`,
                        bold: true,
                      }),
                    ],
                  }),
                  new Paragraph({
                    alignment: AlignmentType.CENTER,
                    children: [
                      new TextRun({
                        text: "Tel: - ",
                      }),
                      new TextRun("   "),
                      new TextRun({
                        text: `${
                          orderArr[0]
                            .recipientPhoneNumber || null
                        }`,
                        bold: true,
                      }),
                    ],
                  }),
                  new Paragraph({
                    alignment: AlignmentType.CENTER,
                    children: [
                      new TextRun("Summa: - "),
                      new TextRun("   "),
                      new TextRun({
                        text: `${
                          orderArr[0].totalPrice.toLocaleString(
                            "RU-RU"
                          ) || null
                        } so\`m`,
                        bold: true,
                      }),
                    ],
                  }),
                  new Paragraph({
                    alignment: AlignmentType.CENTER,
                    children: [
                      new TextRun("Tovar: - "),
                      new TextRun("   "),
                      new TextRun({
                        text: `${orderArr[0].note?.substr(
                          0,
                          orderArr[0].note?.indexOf(" ")
                        )}`,
                        bold: true,
                      }),
                      new Paragraph({ children: [] }),
                    ],
                  }),
                ],
              }),
              new TableCell({
                width: {
                  size: 5000,
                  type: WidthType.DXA,
                },
                children: [
                  new Paragraph({ children: [] }),
                  new Paragraph({
                    alignment: AlignmentType.CENTER,
                    children: [
                      new TextRun({
                        text: `${
                          orderArr[1].createdAt
                            ? new Intl.DateTimeFormat(
                                "RU-RU",
                                {
                                  dateStyle: "short",
                                  timeStyle: "short",
                                }
                              ).format(
                                orderArr[1].createdAt
                              )
                            : null
                        }`,
                        bold: true,
                      }),
                    ],
                  }),
                  new Paragraph({
                    alignment: AlignmentType.CENTER,
                    children: [
                      new TextRun("Firma: - "),
                      new TextRun("   "),
                      new TextRun({
                        text: `${
                          orderArr[1].storeOwner
                            ?.storeName || null
                        }`,
                        bold: true,
                      }),
                    ],
                  }),
                  new Paragraph({
                    alignment: AlignmentType.CENTER,
                    children: [
                      new TextRun({
                        text: "ID: -",
                      }),
                      new TextRun("   "),
                      new TextRun({
                        text: `${orderArr[1].id || null}`,
                        bold: true,
                      }),
                    ],
                  }),
                  new Paragraph({
                    alignment: AlignmentType.CENTER,
                    children: [
                      new TextRun({
                        text: "Viloyat: -",
                      }),
                      new TextRun("   "),
                      new TextRun({
                        text: `${
                          orderArr[1].region?.name || null
                        }`,
                        bold: true,
                      }),
                    ],
                  }),
                  new Paragraph({
                    alignment: AlignmentType.CENTER,
                    children: [
                      new TextRun({
                        text: "Tumani: -",
                      }),
                      new TextRun("   "),
                      new TextRun({
                        text: `${
                          orderArr[1].district?.name || null
                        }`,
                        bold: true,
                      }),
                    ],
                  }),
                  new Paragraph({
                    alignment: AlignmentType.CENTER,
                    children: [
                      new TextRun({
                        text: "Xaridor: -",
                      }),
                      new TextRun("   "),
                      new TextRun({
                        text: `${
                          orderArr[1].recipient || null
                        }`,
                        bold: true,
                      }),
                    ],
                  }),
                  new Paragraph({
                    alignment: AlignmentType.CENTER,
                    children: [
                      new TextRun({
                        text: "Tel: - ",
                      }),
                      new TextRun("   "),
                      new TextRun({
                        text: `${
                          orderArr[1]
                            .recipientPhoneNumber || null
                        }`,
                        bold: true,
                      }),
                    ],
                  }),
                  new Paragraph({
                    alignment: AlignmentType.CENTER,
                    children: [
                      new TextRun("Summa: - "),
                      new TextRun("   "),
                      new TextRun({
                        text: `${
                          orderArr[1].totalPrice?.toLocaleString(
                            "RU-RU"
                          ) || null
                        } so\`m`,
                        bold: true,
                      }),
                    ],
                  }),
                  new Paragraph({
                    alignment: AlignmentType.CENTER,
                    children: [
                      new TextRun("Tovar: - "),
                      new TextRun("   "),
                      new TextRun({
                        text: `${orderArr[1].note?.substr(
                          0,
                          orderArr[1].note?.indexOf(" ")
                        )}`,
                        bold: true,
                      }),
                    ],
                  }),
                  new Paragraph({ children: [] }),
                ],
              }),
            ],
          }),
        ],
      });
      children.push(table);
    });

    const doc = new Document({
      sections: [
        {
          properties: {
            grid: { charSpace: 300 },
            page: {
              margin: {
                top: 0,
                left: 0,
                bottom: 0,
                right: 0,
              },
            },
          },
          children,
        },
      ],
    });
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=${new Date().toISOString}.docx`
    );
    return Packer.toBuffer(doc).then(buffer => {
      res.status(200).end(buffer);
    });
  }
);
