const { comparePassword } = require("../helpers/bcrypt");
const { generateToken } = require("../helpers/jwt");
const { ValidationError } = require('sequelize');
const { User } = require("../models");

class UserController {
    /**
     * Register
     */
    static register(req,res) {
        let {full_name,email,password,gender} = req.body;

        User.create({
            full_name,
            email,
            password,
            gender,
        })
        .then(result => {
            let responseBody = {
                user: {
                    id: result.id,
                    full_name,
                    email,
                    gender,
                    balance: result.balance,
                    createdAt: result.createdAt,
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
     * Login
     */
    static login(req,res) {
        let {email,password} = req.body;

        User.findOne({
            where:{
                email
            }
        })
        .then(result => {
            if (!result) {
                throw {
                    code: 401,
                    message: `email or password is wrong`
                }
            }

            const passIsCorrect = comparePassword(password,result.password);

            if (!passIsCorrect) {
                throw {
                    code: 401,
                    message: `email or password is wrong`
                }
            }

            let payload = {
                id: result.id,
                email: result.email,
                role: result.role
            }

            let responseBody = {
                token: generateToken(payload)
            }

            return res.status(200).json(responseBody);
        })
        .catch(err => {
            if (err.code == 401) {
                return res.status(err.code).json({message:err.message});
            } else {
                return res.status(500).json(err);                
            }
        })
    }

    /**
     * Update
     */
    static update(req,res) {
        let {full_name,email} = req.body;

        User.update(
            {
                full_name,
                email,
            },
            {
                where:{
                    id: req.params.id
                },
                returning:true
            }
        )
        .then(result => {
            let responseBody = {
                user: {
                    id: result[1][0]['id'],
                    full_name: result[1][0]['full_name'],
                    email: result[1][0]['email'],
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

        User.destroy({
            where:{
                id: req.params.id
            },
        })
        .then(result => {
            return res.status(200).json({message:"Your account has been successfully deleted"});
        })
        .catch(err => {
            return res.status(500).json(err);
        })
    }

    /**
     * TopUp
     */
    static topup(req,res) {
        const userData = res.locals.user;
        let { balance } = req.body;

        User.findOne({ 
            where: { id: userData.id } 
        })
        .then(result => {
            let newBalance = parseInt(result.balance)+parseInt(balance);

            User.update(
                {
                    balance: newBalance,
                },
                {
                    where:{
                        id: userData.id
                    },
                    returning:true,
                }
            )
            .then(result => {
                return res.status(200).json({message:`Your balance has been successfully updated to Rp ${result[1][0].balance}`});
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
        })
        .catch(err => {
            return res.status(500).json(err);
        })
    }
}

module.exports = UserController;