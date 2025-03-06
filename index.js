const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const Stock=require('./models/Stock');
const Transaction=require('./models/Transaction');
const stockController = require('./controller/stockController');
const {DataTypes} = require("sequelize");
const {response} = require("express");
require('dotenv').config(); // Load environment variables

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST'],
    }
});

app.use(cors()); // Use CORS middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/api/stocks', stockController);

io.on('connection', (socket) => {
    console.log('A user connected '+socket.id);

    socket.on('disconnect', () => {
        console.log('User Disconnected');
    });

    socket.on('stock_change', async (msg) => {
        try {
            console.log('\n\nstock_change: ' + msg['quantity']+" "+msg['stock_code']+" "+msg['stock_id']+" "+msg['stock_company_name']);
            const stock=await Stock.findOne({
                where:{
                    stock_id:msg['stock_id']
                }
            })
            let newPrice=stock.stock_price*(1+(0.75*(msg['quantity']/2000)));
            newPrice=Math.round(newPrice*100)/100;
            stock.stock_price=newPrice;
            stock.stock_quantity_left=stock.stock_quantity_left-msg['quantity'];
            await stock.save();

            const newTransaction=Transaction.build({
                transaction_type:'BUY',
                transaction_amount:newPrice,
                transaction_time:new Date().toTimeString().split(' ')[0],
                stock_id:msg['stock_id'],
                stock_company_name:msg['stock_company_name'],
                stock_company_code:msg['stock_code'],

                transaction_date: new Date().toISOString().split('T')[0]
            });
            console.log(newTransaction);
            await newTransaction.save().then((response)=>{
                console.log("\n\n"+response);
            }).catch((err)=>{
                console.log('\n\n'+err);
            });

            io.emit('stock_inc',{stock:stock});
        } catch (error) {
            console.error('Error handling stock_change:', error);
        }
    });

    socket.on('stock_sell',async (data)=>{
        try{
            console.log(data);
            const stock=await Stock.findOne({
                where:{
                    stock_id:data['stock_id']
                }
            });
            let newPrice=stock.stock_price*(1-(0.75*(data['quantity']/2000)));
            newPrice=Math.round(newPrice*100)/100;
            stock.stock_price=newPrice;
            stock.stock_quantity_left=parseInt(stock.stock_quantity_left)+parseInt(data['quantity']);
            await stock.save();

            const newTransaction=Transaction.build({
                transaction_type:'SELL',
                transaction_amount:newPrice,
                transaction_time:new Date().toTimeString().split(' ')[0],
                stock_id:data['stock_id'],
                stock_company_name:data['stock_company_name'],
                stock_company_code:data['stock_code'],

                transaction_date: new Date().toISOString().split('T')[0]
            });
            console.log(newTransaction);
            await newTransaction.save().then((response)=>{
                console.log("\n\n"+response);
            }).catch((err)=>{
                console.log('\n\n'+err);
            });

            io.emit('stock_sell',{stock:stock});
        } catch (err){
            console.error(err);
        }
    });
});

server.listen(process.env.SERVER_PORT, () => {
    console.log(`Server is running on port ${process.env.SERVER_PORT}`);
});
