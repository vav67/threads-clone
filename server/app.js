const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const ErrorHandler = require("./middleware/error");

app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended:true,limit:"50mb"}));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// config
if(process.env.NODE_ENV!=="PRODUCTION"){
    require("dotenv").config({
        path:".env"
    })}

  
 /**
  *  
    npm install cors
    Импортируйте cors в вашем файле app.js:
    const cors = require('cors');
// После установки других middleware, но перед определением маршрутов
app.use(cors());

Это позволит вашему Express.js-приложению обрабатывать CORS и принимать
 запросы от различных источников. Если у вас есть специфичные требования
  к настройке CORS, вы можете передать соответствующие параметры в cors().

Обратите внимание, что порядок использования middleware важен.
 app.use(cors()) должен быть установлен после других middleware, 
 которые обрабатывают запросы (например, express.json() и cookieParser()),
  но до определения маршрутов.

*/


// Route imports
const user = require("./routes/user");
const probaRouter = require("./routes/proba"); // новый роутер
const post = require("./routes/Post");

const admin = require("./routes/admin");

app.use("/api/v1", user);
app.use("/api/proba", probaRouter); // новый роутер
app.use("/api/v1", post); 

app.use("/api/v1", admin); 

// it's for errorHandeling
app.use(ErrorHandler);

module.exports = app




     