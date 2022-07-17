import Joi from 'joi';

class FieldValidators {
   constructor(checkObject){
      this.checkObject = checkObject
   }
   validateAuthSchema(checkObject){
      try{
         const isValid = Joi.object({
            username:Joi.string().label('User Name'),
            email:Joi.string().email().label('Email'),
            phone:Joi.string().max(15).optional().label('Mobile No.'),
            password:Joi.string().required().label('Password'),
            confirmPassword:Joi.any().valid(Joi.ref('password')).required().messages({
               "any.only" : "Password and Confirm Password must match",
               "string.empty":"Please re enter your Password"
            }).label('Confirm Password'),
            rememberMe:Joi.valid(true,false).required(), 
         })
         // .when('phone',{
         //    is:Joi.string().exist(),
         //    then:Joi.string().optional().default('+00-(000) 000 0000')
         //       .pattern(/^\+\d{1,4}-\(\d{1,3}\)\s\d{1,3}\s\d{1,5}+$/)
         //       .trim()
         // })
         return isValid.validate(checkObject,{abortEarly:false})
      }catch(err){
         console.log(err)
      }
   }
}
export default FieldValidators;