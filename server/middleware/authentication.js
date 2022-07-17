import jwt from 'jsonwebtoken';
import { StatusCodes } from 'http-status-codes';
import { CustomAPIError } from '../exception/handler/CustomAPIError.js';
import { UnAuthorizedAccess } from './../exception/UnAuthorizedAccess.js';
import { UNAUTHORIZED_ACCESS_DESC,UNAUTHORIZED_ACCESS_MESSAGE } from './../utils/constants.js';
import { generateSecketCipher } from './cipher-text.js';

class Authentication {
   constructor(){
      this.secretJWTKey = generateSecketCipher()
   }
   async signJwtToken(data){
      const token = jwt.sign(data,this.secretJWTKey,{expiresIn:process.env.JWT_LIFETIME})
      if (token)
         return token
      else
         return CustomAPIError(StatusCodes.BAD_REQUEST,"Tokenization Error")
   }
   async verifyToken(request,response,next){
      const authenticationHeader =  request.header.authentication;

      if (!authenticationHeader || !authenticationHeader.startsWith('Bearer')){
         throw new UnAuthorizedAccess(UNAUTHORIZED_ACCESS_DESC,UNAUTHORIZED_ACCESS_MESSAGE);
      }
      const token = authenticationHeader.split(" ")[1]
      try{
         const verifiedTokenPayload = jwt.verify(token,this.secretJWTKey)
         return verifiedTokenPayload
      }
      catch(err){
         console.error(err);
      }
   }
}
export default Authentication;