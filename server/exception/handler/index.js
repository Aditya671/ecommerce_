import { StatusCodes } from "http-status-codes";
import { CustomAPIError } from "./CustomAPIError.js";
import fs from'fs';

export const errorHandler = (err,req,res,next) => {
   const defaultError = new CustomAPIError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      "Server Error",
      "Please Check again after Sometime"
   );
   
   if(err){
      defaultError.errorCode = err.errorCode,
      defaultError.description = err.description,
      defaultError.message = err.message
   }
   if (req.file){
      fs.unlink(req.file.path,(err) => {
         defaultError.message = err.message;
      })
   }
   if (err.code && err.code === 11000){
      defaultError.errorCode = err.code
      defaultError.message = `${Object.keys(err.keyValue)} has to be unique`
   }else{
      defaultError.message = err;
      defaultError.errorCode = StatusCodes.BAD_REQUEST
   }
   console.log(err)  
   res.status(defaultError.errorCode).send(defaultError.message)
}
