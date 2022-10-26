const { ValidationError } = require('sequelize');
const { TransactionHistory,Product,User } = require("../models");

class TransactionController {
    /**
     * Create
     */
    static create(req,res) {
        let { ProductId,quantity } = req.body;
        let userData = res.locals.user;

        TransactionHistory.create(
            {
                UserId: userData.id,
                ProductId,
                quantity
            },
            // {
            //     include: [
            //         { model: Product, attributes: ['id','title','price','stock','CategoryId','createdAt','updatedAt']},
            //     ]
            // }
        )
        .then(async result => {
            let productName = await Product.findOne({where:{ id:ProductId }}).then(result => result.title);

            let responseBody = {
                message:"you have successfully purchase the product",
                transactionBill: {
                    total_price: result.total_price,
                    quantity: result.quantity,
                    product_name: productName
                }
            }

            return res.status(201).json(responseBody);
        })
        .catch(err => {
            if (err instanceof ValidationError == false) {
                res.status(500).json({
                    error:true,
                    message:err,
                });  
            } 
            else {
                const messages = [];
                err.errors.forEach((error) => {
                    messages.push({
                        key:error.path,
                        msg:error.message,
                    })
                });

                return res.status(400).json({
                    message:messages,
                }); 
            }
        })
    }

    /**
     * Get All - User
     */
    static getAllForUser(req,res) {
        let userData = res.locals.user;

        TransactionHistory.findAll({
            where: {
                UserId: userData.id
            },
            include: [
                { model: Product, attributes: ['id','title','price','stock','CategoryId']},
            ]
        })
        .then(result => {
            let newResult = result.map(data => {
                data.total_price = "Rp "+data.total_price;
                data.Product.price = "Rp "+data.Product.price;
                return data
            })
            return res.status(200).json({
                transactionHistories: newResult
            });
        })
        .catch(err => {
            return res.status(500).json({
                error:true,
                message:err,
            });
        })
    }

    /**
     * Get All - Admin
     */
    static getAllForAdmin(req,res) {
        TransactionHistory.findAll({
            include: [
                { model: Product, attributes: ['id','title','price','stock','CategoryId']},
                { model: User, attributes: ['id','email','balance','gender','role']},
            ]
        })
        .then(result => {
            let newResult = result.map(data => {
                data.total_price = "Rp "+data.total_price;
                data.Product.price = "Rp "+data.Product.price;
                data.User.balance = "Rp "+data.User.balance;
                return data
            })
            return res.status(200).json({
                transactionHistories: newResult
            });
        })
        .catch(err => {
            return res.status(500).json({
                error:true,
                message:err,
            });
        })
    }

    /**
     * Get One
     */
    static getDetail(req,res) {
        let transactionId = req.params.transactionId || 0;

        TransactionHistory.findOne({
            where: {
                id: transactionId
            },
            include: [
                { model: Product, attributes: ['id','title','price','stock','CategoryId']},
            ]
        })
        .then(result => {
            result.total_price = "Rp "+result.total_price;
            result.Product.price = "Rp "+result.Product.price;

            return res.status(200).json(result);
        })
        .catch(err => {
            return res.status(500).json({
                error:true,
                message:err,
            });
        })
    }
}

module.exports = TransactionController;