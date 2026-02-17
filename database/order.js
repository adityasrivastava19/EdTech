const mongoose=require("mongoose");
const { required } = require("zod/mini");
const orderSchema=new mongoose.Schema({
user:{
    type:mongoose.Types.Schema.ObjectId
    ,ref:"user",
    required:true
},
course:{
    type:mongoose.Types.Schema.ObjectId,
    ref:"course",
    required:true
},
payment:{
    type:String,
    required:true,
}
},
{timestamps:true}
);