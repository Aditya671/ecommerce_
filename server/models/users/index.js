import mongoose from "mongoose";
import Joi from "joi";

const usersSchema = mongoose.Schema({
   userId:String,
   username:String,
   age:Number,
   title:String,
   firstName:String,
   lastName:String,
   phone:String,
   email:String,
   currentLocation:String,
   profileImage:String,
   gender:String,
   address:String,
   city:String,
   country:String,
   countryCode:String
});
usersSchema.methods.joiValidate = (userObject) => {
   let userValidationSchema = Joi.object({
      userId:Joi.string().id().required(),
      username:Joi.string().min(6).max(20).required(),
      age:Joi.number().required(),
      title:Joi.string().valid('Mr.','Mrs.','Miss','Master','Others').required(),
      firstName:Joi.string().required().regex(/\w/),
      lastName:Joi.string().required().regex(/\w/),
      phone:Joi.string().required().regex(/^\d{10}$/),
      email:Joi.string().email({minDomainSegments:4,tlds:{allow:['net','com','co','ai']}}).required(),
      currentLocation:Joi.string().required(),
      profileImage:Joi.string().required(),
      gender:Joi.string().valid('Male','Female','Others'),
      address:Joi.string().required(),
      city:Joi.string().required(),
      country:Joi.string().required(),
      // country:Joi.string().custom(value,helper => {
      //    return helper.message('This country is not supported')
      // }).required(),
      countryCode:Joi.string().required(),
   })
   return userValidationSchema.validate(userObject)
}
export default mongoose.model('Users',usersSchema);