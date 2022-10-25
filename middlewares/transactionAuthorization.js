const { User,TransactionHistory } = require("../models");

function authorization(req,res,next) {
    const userData = res.locals.user;
    let transactionId = req.params.transactionId || 0;

    User.findOne({
        where: {
            id:userData.id
        }
    })
    .then(userResult => {
        if (userResult == null) {
            return res.status(403).json({
                message: `access denied`
            });
        }
        else {
            TransactionHistory.findOne({
                where: {
                    id:transactionId
                }
            })
            .then(result => {
                if (result == null) {
                    return res.status(404).json({
                        message: `transaction not found`
                    });
                }
                else{
                    if (userResult.role == 0) {
                        next();
                    } 
                    else {
                        if (result.UserId == userData.id) {
                            next();
                        } 
                        else {
                            return res.status(403).json({
                                message: `access denied`
                            });
                        }
                    }
                }
            })
            .catch(err => {
                return res.status(500).json(err);
            })
        }
    })
    .catch(err => {
        return res.status(500).json(err);
    })
}

module.exports = authorization;