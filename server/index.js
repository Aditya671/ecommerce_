import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoSantitze from 'express-mongo-sanitize';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import bodyParser from 'body-parser';
import multer from 'multer';
import xss from 'xss-clean';
import helmet  from 'helmet';
import rateLimit from "express-rate-limit";
import session from 'express-session';
import { default as connectMongoDBSession} from 'connect-mongodb-session';

// File Imports
import authRouters from './routers/users/index.js';
import Authentication  from './middleware/authentication.js';
import { mongoDbConnect } from './utils/mongoConnect.js';
import { errorHandler } from './exception/handler/index.js';

// Configurations
const MongoDBStore = connectMongoDBSession(session);
const authenticateUser = new Authentication()
const app = express();
const store = new MongoDBStore({
   uri:process.env.MONGO_URL,
   collection:'session'
})
const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config();
const corsOptions = {
   origin:"http://localhost:3000",
   optionsSuccessStatus:200,
   method:['GET','POST','PATCH','DELETE','UPDATE']
}
const port = process.env.PORT || 8000;
const rateLimiter = rateLimit({
   windowMs:15 * 60 * 100,
   max:100,
   standardHeaders:true,
   legacyHeaders:false,
   message:"Too Many Requests from this Ip address, Try again after 15 minutes"
});

// Server Configurations
app.use(express.static(path.resolve(__dirname,'./client/build')));
app.use(express.static(path.resolve(__dirname,'./client/public')));
app.use(bodyParser.urlencoded({extended:false}));
app.use(xss());
app.use(helmet());
app.use(rateLimiter);
app.use(mongoSantitze());
app.use(cors(corsOptions));
app.use(express.json());
app.use(session({  
   secret:process.env.SECRET_CIPHER,
   resave:false,
   saveUninitialized:false,
   store:store,
   cookie:{maxAge:1000 * 60 * 60 * 24 * 7}}
));

// Main Application Start Here
app.use('/api/welcome',(req,res,next) => {
   res.send("Hello!! Welcome to the Ecommerce App")
})
app.use('/api/v1',authRouters);

// app.use(authenticateUser.verifyToken)
// Handle Server
const start = async () => {
   try{
      await mongoDbConnect(process.env.MONGO_URL);
      app.listen(port,() => console.log("server listen"));
   }
   catch(err){
      next(err)
   }
}
app.use(errorHandler)
start();