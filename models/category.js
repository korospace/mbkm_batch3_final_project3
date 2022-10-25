'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Category extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.hasMany(models.Product)
    }
  }
  Category.init({
    type: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          args: true,
          msg: "type is required"
        },
        notNull: {
          msg: 'type is required'
        }
      }
    },
    sold_product_amount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: {
          args: true,
          msg: "sold_product_amount is required"
        },
        notNull: {
          msg: 'sold_product_amount is required'
        },
        isNumeric: {
          value: true,
          msg: "type of sold_product_amount must number"
        },
      }
    }
  }, {
    sequelize,
    modelName: 'Category',
    hooks: {
      beforeValidate: (cat,opt) => {
        if (opt.type !== 'BULKUPDATE') {
          cat.sold_product_amount = 0;
        }
      },
    }
  });
  return Category;
};