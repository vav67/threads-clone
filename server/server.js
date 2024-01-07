const app = require("./app");
const cloudinary = require("cloudinary");
//const connectDatabase = require("./db/db");
//const connectDb = require("./db/db");

// Handling uncaught Exception
process.on("uncaughtException",(err) =>{
    console.log(`Error: ${err.message}`);
    console.log(`Shutting down the server for Handling uncaught Exception`);
})

// config
if(process.env.NODE_ENV!=="PRODUCTION"){
    require("dotenv").config({
        path:".env"
    })}

// connect database
///const ss = connectDb()  //connectDatabase();
//console.log(`mongodb is connected with server: ${data.connection.host}`);
//console.log(`mongodb is connected with server  work `) ///: ${ss.connection}`);
 




cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

// create server
const server = app.listen(process.env.PORT,() =>{
    console.log(`Server is working on PORT:${process.env.PORT}`)
})


// Unhandled promise rejection
process.on("unhandledRejection", (err) =>{
    console.log(`Shutting down server for ${err.message}`);
    console.log(`Shutting down the server due to Unhandled promise rejection`);
    server.close(() =>{
        process.exit(1);
    });
});