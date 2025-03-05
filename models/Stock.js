const {DataTypes} = require('sequelize');
const sequelize = require('../config/Sequelize');
const Stock=sequelize.define('Stock',{
    stock_id:{
        type:DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true
    },
    stock_company_name:{
        type:DataTypes.STRING,
        allowNull:false
    },
    stock_company_code:{
        type:DataTypes.STRING,
        allowNull:false
    },
    stock_price:{
        type:DataTypes.DOUBLE,
        allowNull:false
    },

    stock_quantity_left:{
        type:DataTypes.INTEGER,
        allowNull:false
    }
});
module.exports=Stock;
