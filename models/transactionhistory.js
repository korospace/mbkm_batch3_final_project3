'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class TransactionHistory extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.Product);
      this.belongsTo(models.User);
    }
  }
  TransactionHistory.init({
    ProductId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: {
          args: true,
          msg: "ProductId is required"
        },
        notNull: {
          msg: 'ProductId is required'
        },
        async WrongProductId(value) {
          let id = (value) ? value : null;

          if (id != null) {
            const [results] = await sequelize.query(`SELECT * FROM public."Products" WHERE id = ${id}`);
            if (results.length == 0) {
              throw new Error(`ProductId ${value} is not exist`);
            }
          }
        }
      }
    },
    UserId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: {
          args: true,
          msg: "UserId is required"
        },
        notNull: {
          msg: 'UserId is required'
        },
      }
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: {
          args: true,
          msg: "quantity is required"
        },
        notNull: {
          msg: 'quantity is required'
        },
        isNumeric: {
          value: true,
          msg: "type of quantity must number"
        },
        async QuantityCheck(value) {
          let quantity = (value) ? value : null;

          if (quantity != null) {
            const [results] = await sequelize.query(`SELECT * FROM public."Products" WHERE id = ${this.ProductId}`);

            if (results.length != 0) {
              if (quantity > results[0]["stock"]) {
                throw new Error(`not enough stock, ${results[0]["stock"]} pieces available`);
              }
            }
          }
        }
      }
    },
    total_price: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: {
          args: true,
          msg: "total_price is required"
        },
        notNull: {
          msg: 'total_price is required'
        },
        isNumeric: {
          value: true,
          msg: "type of total_price must number"
        },
        async BalanceCheck(value) {
          let tot = (value!=0) ? value : null;

          if (tot != null) {
            const [results] = await sequelize.query(`SELECT * FROM public."Users" WHERE id = ${this.UserId}`);

            if (results.length != 0) {
              if (tot > results[0]["balance"]) {
                throw new Error(`not enough balance, Rp ${results[0]["balance"]} available`);
              }
            }
          }
        }
      }
    },
  }, {
    sequelize,
    modelName: 'TransactionHistory',
    hooks: {
      beforeValidate: async (trans,opt) => {
        if (opt.type !== 'BULKUPDATE') {
          const [results] = await sequelize.query(`SELECT * FROM public."Products" WHERE id = ${trans.ProductId ? trans.ProductId : null}`);

          if (results.length != 0) {
            trans.total_price = trans.quantity*results[0].price;
          }
          else {
            trans.total_price = 0;
          }
        }
      },
      afterCreate: async (trans,opt) => {
        if (opt.type !== 'BULKUPDATE') {
          await sequelize.query(`UPDATE public."Products" SET stock = stock-${trans.quantity} WHERE id = ${trans.ProductId}`);
          await sequelize.query(`UPDATE public."Users" SET balance = balance-${trans.total_price} WHERE id = ${trans.UserId}`);

          const [results] = await sequelize.query(`SELECT * FROM public."Products" WHERE id = ${trans.ProductId}`);
          await sequelize.query(`UPDATE public."Categories" SET sold_product_amount = sold_product_amount+${trans.quantity} WHERE id = ${results[0].CategoryId}`);

          // modify price
          trans.total_price = "Rp "+trans.total_price;
        }
      }
    }
  });
  return TransactionHistory;
};