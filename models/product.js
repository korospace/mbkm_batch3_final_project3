'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.Category)
    }
  }
  Product.init({
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          args: true,
          msg: "title is required"
        },
        notNull: {
          msg: 'title is required'
        }
      }
    },
    price: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: {
          args: true,
          msg: "price is required"
        },
        notNull: {
          msg: 'price is required'
        },
        isNumeric: {
          value: true,
          msg: "type of price must number"
        },
        min: {
          args: [0],
          msg: "min value price is 0"
        },
        max: {
          args: [50000000],
          msg: "max value price is 50000000"
        }
      }
    },
    stock: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: {
          args: true,
          msg: "price is required"
        },
        notNull: {
          msg: 'price is required'
        },
        isNumeric: {
          value: true,
          msg: "type of price must number"
        },
        min: {
          args: [5],
          msg: "min value stock is 5"
        }
      }
    },
    CategoryId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: {
          args: true,
          msg: "CategoryId is required"
        },
        notNull: {
          msg: 'CategoryId is required'
        },
        async WrongCategoryId(value) {
          let id = (value) ? value : null;

          if (id != null) {
            const [results] = await sequelize.query(`SELECT * FROM public."Categories" WHERE id = ${id}`);
            if (results.length == 0) {
              throw new Error(`CategoryId ${value} is not exist`);
            }
          }
        }
      }
    },
  }, {
    sequelize,
    modelName: 'Product',
    hooks: {
      afterCreate: (prod,opt) => {
        prod.price = "Rp "+prod.price;
      }
    }
  });
  return Product;
};