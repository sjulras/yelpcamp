
var mongoose = require('mongoose');
const PassportLocalMongoose = require("passport-local-mongoose")
var UserSchema = new mongoose.Schema({
    username:{ type:String,unique:true, required:true},
    password: String,
    avatar: String,
    firstName: String,
    lastName:String,
    email:{ type:String,unique:true, required:true},
    created:{type:Date, default:Date.now},
    isAdmin: {type:Boolean, default:false},
    resetPasswordToken : String,
    resetPasswordExpires : Date 
})
UserSchema.plugin(PassportLocalMongoose)
module.exports = mongoose.model("User", UserSchema)