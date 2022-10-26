const { ValidationError } = require('sequelize');
const { Product } = require("../models");

class ProductController {
    /**
     * Create
     */
    static create(req,res) {
        let { title,price,stock,CategoryId } = req.body;

        Product.create({
            title,
            price,
            stock,
            CategoryId
        })
        .then(result => {
            let responseBody = {
                product: {
                    id: result.id,
                    title,
                    price: result.price,
                    stock: result.stock,
                    CategoryId: result.CategoryId,
                    createdAt: result.createdAt,
                    updatedAt: result.updatedAt,
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
     * Get All
     */
    static getAll(req,res) {
        Product.findAll({
            include: [
            ]
        })
        .then(result => {
            let newResult = result.map(data => {
                data.price = "Rp "+data.price
                return data;
            })

            return res.status(200).json({
                products: newResult
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
     * Update
     */
    static update(req,res) {
        let {price,stock,title} = req.body;

        Product.update(
            {
                price,
                stock,
                title
            },
            {
                where:{
                    id: req.params.id
                },
                returning:true
            }
        )
        .then(result => {
            if (result[0] == 0) {
                return res.status(404).json({message:`product with id(${req.params.id}) is not found`});
            }

            console.log(result);
            let responseBody = {
                product: {
                    id: result[1][0]['id'],
                    price: "Rp "+result[1][0]['price'],
                    stock: result[1][0]['stock'],
                    title: result[1][0]['title'],
                    CategoryId: result[1][0]['CategoryId'],
                    createdAt: result[1][0]['createdAt'],
                    updatedAt: result[1][0]['updatedAt'],
                }
            }

            return res.status(200).json(responseBody);
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
                    return messages.push({
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
     * Patch Update
     */
    static patchUpdate(req,res) {
        let { CategoryId } = req.body;

        Product.update(
            {
                CategoryId,
            },
            {
                where:{
                    id: req.params.id
                },
                returning:true
            }
        )
        .then(result => {
            if (result[0] == 0) {
                return res.status(404).json({message:`product with id(${req.params.id}) is not found`});
            }

            let responseBody = {
                product: {
                    id: result[1][0]['id'],
                    price: "Rp "+result[1][0]['price'],
                    stock: result[1][0]['stock'],
                    title: result[1][0]['title'],
                    CategoryId: result[1][0]['CategoryId'],
                    createdAt: result[1][0]['createdAt'],
                    updatedAt: result[1][0]['updatedAt'],
                }
            }

            return res.status(200).json(responseBody);
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
                    return messages.push({
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
     * Delete
     */
    static delete(req,res) {

        Product.destroy({
            where:{
                id: req.params.id
            },
            // returning:true
        })
        .then(result => {
            if (result == 0) {
                return res.status(404).json({message:`product with id(${req.params.id}) is not found`});
            }

            return res.status(200).json({message:"Your product has been successfully deleted"});
        })
        .catch(err => {
            return res.status(500).json(err);
        })
    }
}

module.exports = ProductController;