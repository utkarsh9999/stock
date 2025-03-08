const Stock=require('../models/Stock');
const Transaction=require('../models/Transaction');
const app=require('express');
const router=app.Router();
const sequelize=require('../config/Sequelize');


router.get('/transactions/:stock_id',async (req,resp)=>{
    try{
        const stock_id=req.params['stock_id'];
        const transactions=await Transaction.findAll({
            where:{
                stock_id:stock_id
            }
        });
        console.log('\n\n',transactions,'\n\n')
        resp.status(200).send(transactions);
    } catch (err){

    }
});

router.get('/trans-stats',async (req,resp)=>{
    try {
        const [stats]=await sequelize.query("SELECT stock_company_name, stock_id , COUNT( stock_id) AS stock_num FROM `transactions` WHERE 1 GROUP BY stock_id");
        resp.status(200).send(stats);
    } catch (err){

    }
});


router.get('/stock-list',async (req,resp)=>{
    try {
        const stocks=await Stock.findAll();
        resp.status(200).send(stocks);
    }
    catch (err){
        console.error(err);
        resp.status(400).send(err);
    }
});

router.get('/stock/:stock_id',async (req,resp)=>{
   const stock_id=req.params['stock_id'];
   console.log(stock_id);
   const stock=await Stock.findOne({
       where: {stock_company_code: stock_id}
   });
   resp.send(stock);
});
module.exports=router;
