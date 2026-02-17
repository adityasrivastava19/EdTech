const rozarpay=require('razorpay');
const instance=new rozarpay({
    key_id:process.env.KEY_ID,
    key_secret:process.env.KEY_SECRET
})
module.exports=instance;