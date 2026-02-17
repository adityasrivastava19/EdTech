const mongoose=require('mongoose');
try{
    await mongoose.connect(process.env.MONGO_URL);
    console.log("Database Connected");
}
catch(err){
    console.log(err);
}
module.exports=mongoose;
