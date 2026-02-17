const { required } = require("zod/mini");

const mongoose=require(mongoose);
const courseSchema=new mongoose.courseSchema({
    tittle:{
        type:String,
        required:true
    },
    description:{
        type:String ,
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    videourl:{
        type:String,
        required:true,
    },
    public_id:{
        type:String,
        required:true
    },
    instructor:{
        type:mongoose.Types.Schema.ObjectId,
        ref:"user",
        required:true
    }
},
{timestamps:true}
);
module.exports=mongoose.model("course",courseSchema);