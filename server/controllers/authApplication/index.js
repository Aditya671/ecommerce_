
import bcrypt from 'bcryptjs';
import { StatusCodes } from 'http-status-codes';
import { UnAuthorizedAccess } from '../../exception/UnAuthorizedAccess.js';
import { ValidationError } from '../../exception/ValidationError.js';
import userCredentials from '../../models/userAccount/userCredentials.js';
import usersSchema from '../../models/users/index.js';
import Authentication from '../../middleware/authentication.js';
import { CustomAPIError } from '../../exception/handler/CustomAPIError.js';
import FieldValidators from '../../validators/index.js';

class ApplicationAuth{
   
   // Verify Login Details of User Trying to Login
   postLogin(req,res,next){
      try{
         const {email,phone,username,password} = req.body;
         let user = ''
         const validator = new FieldValidators()
         const isValid = validator.validateAuthSchema(req.body)
         if(isValid === true){
            if (email){
               user = userCredentials.findOne({email}).select('+password')
            }else if(phone){
               user = userCredentials.findOne({phone}).select('+password')
            }else if(username){
               user = userCredentials.findOne({username}).select('+password')
            }
         }else{
               throw new ValidationError("Please Enter Correct Details")
         }
         if (!user){
            throw new UnAuthorizedAccess("User is Not Registered","Unauthorized User!!! Please Create an Account ")
         }
         let isPasswordCorrect = ''
         const passCheck  = bcrypt.compare(user.password, password)
         if (passCheck){
            isPasswordCorrect = userCredentials.comparePassword(user.password)
         }
         const data = {email:email,user:user}
         let token = ''
         if (passCheck && isPasswordCorrect){
            token = this.signJwtToken(data)
         }
         req.session.isLoggedIn = true
         user.password = undefined
         req.session.user = user
         res.status(StatusCodes.ACCEPTED).send({user,token});
      }catch(err){
         next(err)
      }
   }
   // Get All User Details if login is SuccessFull
   getUserDetails = async (err,req,res,next) =>  {
      try{
         const userId  = req.session.user._id
         if (!userId){
            throw new UnAuthorizedAccess("User is Not Registered","Unauthorized User!!! Please Create an Account ")
         }
         const user = await usersSchema.findById(userId);
         if (user){
            res.status(StatusCodes.OK).send({user});
         }
      }catch(err){
         next(err)
      }
   }
   // Destroy Logged In User Session - Unauthenticate User
   postLogout = (req,res,next) => {
   try{
      req.session.destroy(err => {
         console.log(err)
      })
      res.status(StatusCodes.OK).send({'msg':'Redirect to Login Page'})
   }catch(err){
      next(err)
   }
   }

   // New User wants to Access the Application ##Create an Account
   async postRegister(req,res,next) {
      try{
         const {username,email,phone,password,confirmPassword,rememberMe} = req.body;
         let user = '';
         const validator = new FieldValidators()
         const isValid = validator.validateAuthSchema(req.body)
         if(!isValid.error){
            if (username && email){
               user = await userCredentials.findOne({email})
            }else if(phone){
               user = await userCredentials.findOne({phone})
            }
         }else{
            let errorDetails = isValid.error.details
            let errorValues = Object.values(errorDetails).map(item => {
               return {
                  fieldName:item.context.label,
                  message:item.message
               }
            })
            
            throw new ValidationError(errorValues)
         }
         if(user !== null){
            throw new CustomAPIError(StatusCodes.BAD_REQUEST,`User with this Eamil: ${user.email}`,"Please Enter New User Details");
         }
         let data = ''
         if (email && username){
            const newEmailUser =  await userCredentials.create({username,email,password})
            const userId = newEmailUser._id
            data =  usersSchema.create({userId,email})
         }else if(phone){
            
            const newMobileUser = await userCredentials.create({phone,password})
            const userId = newMobileUser._id
            data = await usersSchema.create({schemaId:userId,phone})
         }
         const authSign = new Authentication()
         const token = authSign.signJwtToken(data)
         req.session.isLoggedIn = true
         req.session.user = data
         res.status(StatusCodes.CREATED).send({token});
      }catch(err){
         next(err)
      }
   }
}
export default ApplicationAuth;