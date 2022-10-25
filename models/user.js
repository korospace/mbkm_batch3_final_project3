'use strict';

const { hashPassword } = require("../helpers/bcrypt");
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  User.init({
    full_name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          args: true,
          msg: "full_name is required"
        },
        notNull: {
          msg: 'full_name is required'
        }
      }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
        args: true,
        msg: "email is already exist"
      },
      validate: {
        notEmpty: {
          args: true,
          msg: "email is required"
        },
        notNull: {
          msg: 'email is required'
        }
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          args: true,
          msg: "password is required"
        },
        notNull: {
          msg: 'password is required'
        },
        len: {
          args: [6,10],
          msg: "password min 6 char & max 10 char"
        }
      }
    },
    gender: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          args: true,
          msg: "gender is required"
        },
        notNull: {
          msg: 'gender is required'
        },
        isIn: {
          args: [['male', 'female']],
          msg: "gender must be male or female"
        }
      }
    },
    role: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: {
          args: true,
          msg: "role is required"
        },
        notNull: {
          msg: 'role is required'
        },
        isIn: {
          args: [[0, 1]],
          msg: "role must be 0 or 1"
        }
      }
    },
    balance: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: {
          args: true,
          msg: "balance is required"
        },
        notNull: {
          msg: 'balance is required'
        },
        isNumeric: {
          value: true,
          msg: "type of balance must number"
        },
        min: {
          args: [0],
          msg: "min value balance is 0"
        },
        max: {
          args: [100000000],
          msg: "max value balance is 100000000"
        }
      }
    }
  }, {
    sequelize,
    modelName: 'User',
    hooks: {
      beforeValidate: (user,opt) => {
        if (opt.type !== 'BULKUPDATE') {
          user.balance = 0;
          user.role = 1;
        }
      },
      beforeCreate: (user,opt) => {
        user.password = hashPassword(user.password);
      },
      afterCreate: (user,opt) => {
        user.balance = "Rp "+user.balance;
      }
    }
  });
  return User;
};