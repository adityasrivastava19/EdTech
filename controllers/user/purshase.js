const rozarpay=require('rozarpay');
const crypto=require('crypto');
const order=require('../../database/order');
const course=require('../../database/course');
//intiating the rozarpay object
const instance =new rozarpay({
    key_id:process.env.razorpay_key_id,
    key_secret:process.env.razorpay_key_secret
});
//creating order
exports.createorder=async(req,res)=>
{
    try{
        const foundcourse=await course.findById(req.body.courseid);
        if(!foundcourse)
        {
            return res.status(404).json({message:"course not found"});
        }
        const orders=await instance.orders.createorder({
            amount:foundcourse.price*100,
            currency:"INR",
        });
        return res.status(200).json({orderId:orders.id});
    }
    catch(err)
    {
        return res.status(500).json({message:err.message});
    }
}