const mongoose=require('mongoose')

const subscriptionSchema=mongoose.Schema({
    subscriptionType:{
        type:String,
        enum:['daily' , 'weekly' , 'monthly' , 'monthly (5h)'],
        required:true
        
    },
    price:{
        type:Number,
        required:true

    },
    description:{
        type:[String],
        required:true
    },

    roomType:{
        type: String,
        required: [true , 'it must have roomType']
    },

    
})
   const User = mongoose.model('Subscription', subscriptionSchema);
    module.exports = User;