const {DataTypes}=require('sequelize');
const sequelize=require('../config/Sequelize');

const Transaction=sequelize.define('Transaction',{
    transaction_id:{
        type:DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    transaction_type:{
        type:DataTypes.STRING,
    },
    transaction_amount:{
        type:DataTypes.DOUBLE,
        allowNull:false
    },
    transaction_date:{
        type:DataTypes.DATEONLY,
        allowNull:false
    },
    transaction_time:{
        type:DataTypes.TIME,
        allowNull:false
    },
    stock_id:{
        type:DataTypes.INTEGER,
    },
    stock_company_name:{
        type:DataTypes.STRING,
        allowNull:false
    },
    stock_company_code:{
        type:DataTypes.STRING,
        allowNull:false
    },
});
module.exports=Transaction;
