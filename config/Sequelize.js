const {Sequelize}=require('sequelize');
const sequelize = new Sequelize("stock", 'root', '', {
    host: '127.0.0.1',
    port: 3306,

    dialect: "mysql",
    define: {
        timestamps: false,
    },
    logging: false, // Disable logging of SQL queries
});
async function connectDB() {
    try{
        await sequelize.authenticate();
        try {
            await sequelize.sync({alter:true});
            console.log("All models were synchronized successfully.");
        }catch (error){
            console.error(`Unable to sync the database: ${error}`);
        }
        console.log(`Connection to  database has been established successfully.`);
    }catch (error){
        console.error(`Unable to connect to the database: ${error}`);
    }
}
connectDB();
module.exports=sequelize;
