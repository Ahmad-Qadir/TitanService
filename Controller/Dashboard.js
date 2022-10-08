// ! Requirements
require('events').EventEmitter.defaultMaxListeners = Infinity
const validator = require("joi");
const config = require('config');
var uuid = require('uuid');
const {
    roles
} = require('../Middleware/roles');

// ! Collections
const ProductsCollection = require('../models/Product');
const RecordsCollection = require('../models/records');
const ProfileCollection = require('../models/Profiles');
const TrailerCollection = require('../models/Trailers');
const EmployeeClass = require('../models/Employee');
const CompanyCollection = require('../models/Companies');
const ItemUnitCollection = require('../models/ItemUnit');
const DailyCollection = require('../models/Daily_Task');
const {
    Mongoose
} = require('mongoose');

const address = process.env.address

//Authorization
exports.grantAccess = function (action, resource) {
    return async (req, res, next) => {
        try {
            const permission = roles.can(req.user.role)[action](resource);
            if (!permission.granted) {
                return res.render('Components/404')
                // return res.status(401).json({
                //     error: "You don't have enough permission to perform this action"
                // });
            }
            next()
        } catch (error) {
            next(error)
        }
    }
}

//Authentication
exports.allowIfLoggedin = async (req, res, next) => {
    try {
        const user = res.locals.loggedInUser;
        if (!user)
            return res.render('./Components/NotPermited')

        // return res.status(401).json({
        //     error: "You need to be logged in to access this route"
        // });
        req.user = user;
        next();
    } catch (error) {
        next(error);
    }
}

// TODO: Checked and Worked Properly

//Add New Product UI
exports.GetAllMyIncomeUI = async (req, res, next) => {
    try {

        const Items = await ProductsCollection.find({});
        const Status = await RecordsCollection.find({}).distinct("status");
        const Customers = await ProfileCollection.find({});

        res.render('Dashboard/IncomeUI.pug', {
            title: "تۆمارەکان",
            status: Status,
            products: Items,
            customres: Customers
        })

    } catch (error) {
        next(error)
    }
}


//Add New Product UI
exports.GetAllMyIncome = async (req, res, next) => {
    try {

        if (req.body.itemID == "" && req.body.customerID != "") {
            const Invoices = await RecordsCollection.find({
                'cutomerID': req.body.customerID,
            }).populate('productID');
            res.render('Dashboard/Incomes.pug', {
                title: "تۆمارەکان",
                records: Invoices,
                // daily: Daily,
                // returnedmoney: ReturnedMoney,
                // debtors: Debtors,
                // expoenses: TotalExpenses
            })

        } else if (req.body.itemID != "" && req.body.customerID == "") {
            const Invoices = await RecordsCollection.find({
                'productID': req.body.itemID,
            }).populate('productID');
            res.render('Dashboard/Incomes.pug', {
                title: "تۆمارەکان",
                records: Invoices,
                // daily: Daily,
                // returnedmoney: ReturnedMoney,
                // debtors: Debtors,
                // expoenses: TotalExpenses
            })
        } else if (req.body.itemID != "" && req.body.customerID != "") {
            const Invoices = await RecordsCollection.find({
                'productID': req.body.itemID,
                'cutomerID': req.body.customerID,
            }).populate('productID');
            res.render('Dashboard/Incomes.pug', {
                title: "تۆمارەکان",
                records: Invoices,
                // daily: Daily,
                // returnedmoney: ReturnedMoney,
                // debtors: Debtors,
                // expoenses: TotalExpenses
            })
        } else {
            const Invoices = await RecordsCollection.find({
            }).populate('productID');
            res.render('Dashboard/Incomes.pug', {
                title: "تۆمارەکان",
                records: Invoices,
                // daily: Daily,
                // returnedmoney: ReturnedMoney,
                // debtors: Debtors,
                // expoenses: TotalExpenses
            })
        }



        // const Daily = await DailyCollection.aggregate(
        //     [{
        //         $group: {
        //             _id: {
        //                 moneyType: "$moneyType"
        //             },
        //             amount: {
        //                 $sum: "$money"
        //             },
        //         },

        //     }, ]);

        // const ReturnedMoney = await RecordsCollection.aggregate(
        //     [{
        //         $group: {
        //             _id: {
        //                 Compenstate: "$Compenstate"
        //             },
        //             amount: {
        //                 $sum: "$sellPrice"
        //             },
        //         },

        //     }, ]);

        // const TotalExpenses = await RecordsCollection.aggregate(
        //     [{
        //             $group: {
        //                 _id: null,
        //                 amount: {
        //                     $sum: "$totalPrice"
        //                 },
        //                 items: {
        //                     $push: {
        //                         oldDebut: "$oldDebut",
        //                         discount: "$discount",
        //                         prepaid: "$prepaid",
        //                         recordCode: '$recordCode',
        //                         softdelete: "$softdelete",
        //                         trailerNumber: "$trailerNumber",
        //                         productID: "$productID",
        //                         cutomerID: "$cutomerID",
        //                         createdAt: "$createdAt",
        //                         moneyStatus: "$moneyStatus",
        //                         status: "$status",
        //                         totalPrice: "$totalPrice",
        //                         totalQuantity: "$totalQuantity",
        //                         addedBy: "$addedBy",
        //                         sellPrice: "$sellPrice"
        //                     },
        //                 },
        //             },

        //         },
        //         {
        //             $match: {
        //                 "items.status": "New Trailer",
        //             },
        //         }
        //     ]);

        // const Debtors = await ProfileCollection.aggregate(
        //     [{
        //             $group: {
        //                 _id: null,
        //                 amount: {
        //                     $sum: "$remainedbalance"
        //                 },
        //             },

        //         },
        //         // {
        //         //     $match: {
        //         //         softdelete: false,
        //         //         remainedbalance: { $ne: 0 },
        //         //     },
        //         // }
        //     ]);



    } catch (error) {
        next(error)
    }
}