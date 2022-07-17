import mongoose from "mongoose";
import bcrypt from 'bcryptjs';

const userCredential = mongoose.Schema({
   username: {type:String,unique:true,required:false},
   email: {type:String,trim:true,unique:true,required:false},
   password: {type:String, trim:true,required:true},
   phone:{type:String,trim:true,required:false,unique:false}
});

userCredential.pre('save',async function() {
   
   if(!this.isModified('password')) return

   const salt = await bcrypt.genSalt(10);
   this.password = await bcrypt.hash(this.password,salt); 
});
// userCredential.methods.createJWT = function() {
//    const createUser = {userId:this._id,username:this.username,email:this.email,mobileNo:this.mobileNo}
//    const token = authAppUser.signJwtToken(createUser)
//    // return jwt.sign(createUser,process.env.JWT_SECRET,{expiresIn:process.env.JWT_LIFETIME});
//    return token
// };
// userCredential.methods.comparePassword = async function (candidatePassword) {
//    const isMatch = await bcrypt.compare(candidatePassword, this.password)
//    return isMatch
// }
 
export default mongoose.model('usercredentials',userCredential);