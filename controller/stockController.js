const Stock=require('../models/Stock');
const {Sequelize}=require('sequelize');
const app=require('express');
const router=app.Router();


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
