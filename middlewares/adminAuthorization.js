const { User } = require("../models");

function authorization(req,res,next) {
    const userData = res.locals.user;

    User.findOne({
        where: {
            id:userData.id
        }
    })
    .then(result => {
        if (result == null) {
            return res.status(403).json({
                message: `access denied`
            });
        }

        if (result.role == 0) {
            next();
        } 
        else {
            return res.status(403).json({
                message: `access denied`
            });
        }
    })
    .catch(err => {
        return res.status(500).json(err);
    })
}

module.exports = authorization;