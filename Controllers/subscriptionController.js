const express=require('express')
const fs=require('fs')
const Subscription = require('./../Models/Subscription')
const UserSubscription=require('./../Models/userSubscription')
const { fail } = require('assert')

exports.getAllSubscription=async(req,res)=>{
    try{
        const subscriptions=await Subscription.find()
        res.status(200).json({
            status:'success',
            data:{
                subscriptions:subscriptions
            }
        })
    }catch{
        res.status(404).json({
            status:'fail',
            data:{
                message:'No subscription found'
            }
        })
    }
}
exports.updateSubecription=async(req,res)=>{
    try{
        const id=req.params.id
        const updatedSubscription=await Subscription.findByIdAndUpdate(id,req.body,{new:true,
            runValidators:true})
        
        res.status(200).json({
            status:'success',
            data:{
                updatedSubscription:updatedSubscription
            }
        })

    }catch{
        res.status(404).json({
            status:'fail',
            data:{
                message:'No subscription found'
            }
        })
    }
}
exports.deleteSubscription=async(req,res)=>{
    try{
        const id=req.params.id
        await Subscription.findByIdAndDelete(id)
        res.status(204).json({
            status:'success',
            data:{
                message:'Subscription deleted successfully'
        }})

    }catch{
        res.status(404).json({
            status:fail,
            data:{
                message:'No subscription found'
            }
     })
    }
}
exports.addSubscription=async (req,res)=>{
    try{
        const subscription= await Subscription.create(req.body)
        res.status(201).json({  
            status:'success',
            data:{
                subscription:subscription
                }

        })

    }catch(err){
        res.status(400).json({
            "status": "failed",
            "message": err
        })
    }
}
exports.getSubscriptionById=async(req,res)=>{
    try{
        const id=req.params.id
        const subscription=await Subscription.findById(id)
        res.status(204).json({
            status:'success',
            data:{
                subscription:subscription}})

    }catch{
        res.status(404).json({
            status:fail,
            data:{
                message:'No subscription found'
            }
     })
    }
}
const axios = require('axios')
exports.getCheckoutSession = async (req, res) => {
    try {
      const url = "https://api.sandbox.konnect.network/api/v2/payments/init-payment";
  
      const start_date = new Date(req.body.start_date);
      let end_date = new Date(start_date);
  
      const subscription = await Subscription.findById(req.body.subId);
  
      if (subscription.subscriptionType === "daily") {
        end_date.setDate(end_date.getDate() + 1);
        console.log("End date (daily):", end_date.toISOString());
      }
  
      if (subscription.subscriptionType === "weekly") {
        end_date.setDate(end_date.getDate() + 7);
        console.log("End date (weekly):", end_date.toISOString());
      }
  
      if (subscription.subscriptionType.startsWith("monthly")) {
        end_date.setMonth(end_date.getMonth() + 1);
        console.log("End date (monthly):", end_date.toISOString());
      }
  
      const payload = {
        receiverWalletId: process.env.WALLET_ID,
        amount: req.body.amount,
        description: req.body.description,
        acceptedPaymentMethods: ["e-DINAR"],
        successUrl: `http://localhost:3000/subPay?status=success&subId=${req.body.subId}&start_date=${start_date.toISOString()}&end_date=${end_date.toISOString()}`,
        failUrl: `http://localhost:3000/subPay?status=failed`,
      };
  
      const response = await fetch(url, {
        method: "POST",
        body: JSON.stringify(payload),
        headers: {
          "Content-Type": "application/json",
          "x-api-key": process.env.API_KEY_KONNECT,
        },
      });
  
      const resData = await response.json();
  
      res.status(200).json({
        status: "success",
        result: resData,
      });
    } catch (err) {
      res.status(400).json({
        status: "fail",
        message: err,
      });
    }
  };
  

// exports.verify = async (req , res) => {

//     try{
//         // console.log('jjjj')
//         const id_payment = req.params.paymentId
//         console.log(",,"+id_payment)
//         const subId = req.query.subId
//         const idUser = req.query.idUser
//         const start_date = Date.now()
//         // let end_date
//         const start_date1 = req.query.start_date

//         const end_date1 = req.query.end_date
//         // const endDate = req.query.end_date;

//   console.log(req.query);
//         const hh = req.query.end
//         // console.log('first first ' + hh)
//         // console.log('subId= ' + subId + 'idUser= ' + idUser)

//         // const url = https://api.sandbox.konnect.network/api/v2/payments/${id_payment}

//         const response = await fetch(`https://api.sandbox.konnect.network/api/v2/payments/${id_payment}`)

//         const resData = await response.json()
//         // console.log("nnn"+resData.transactions[0])
//         // console.log('woooooohhh '+resData.payment.transactions[0].status)
//         // console.log("hello" + resData.payment.transactions[0].status)
//         if(resData.payment.transactions[0].status === "success"){

//             const subscription = await Subscription.findById(subId)
//             // console.log("subscriptio \n")

//             // console.log(subscription)

//         const end_date = new Date()

//         if (subscription.subscriptionType === "daily") {
//             // let end_date = new Date();
//             end_date1.setDate(end_date1.getDate() + 1);
//             console.log("end-date: " + end_date1.toISOString());
//         }
//         if(subscription.subscriptionType=="weekly"){
//             end_date1.setDate(end_date1.getDay()+7);
//             console.log("end-date"+end_date1)
//         }
//         if(subscription.subscriptionType.startsWith("monthly")){
//             end_date1.setMonth(end_date1.getMonth() + 1);
//             console.log("end date"+end_date1)
//         } 
              

//             console.log('end_date = ' + end_date1)

//             const userSub = {
//                 id_user: idUser,
//                 id_subscription: subId,
//                 start_date: start_date1,
//                 end_date: end_date1,
//             }

//             console.log('userSub\n')
//             console.log(userSub)

//             // console.log("Kr Kr Kr" + end_date1)

//             const newUserSub = await UserSubscription.create(userSub)

//             console.log('newUserSub\n')

//             console.log(newUserSub)

//             res.status(200).json({
//                 status: 'success',
//                 newUserSub         
//             })
//         }
//     }catch(err){
//         res.status(400).json({
//             status: 'fail',
//             message: err
//         })
//     }
// }

exports.verify = async (req, res) => {
    try {
      const id_payment = req.params.paymentId;
      const subId = req.query.subId;
      const idUser = req.query.idUser;
      const start_date1 = req.query.start_date; // this is a string
      const end_date1 = req.query.end_date;     // this is a string
  
      console.log("Query params:", req.query);
  
      const response = await fetch(`https://api.sandbox.konnect.network/api/v2/payments/${id_payment}`);
      const resData = await response.json();
  
      if (resData.payment.transactions[0].status === "success") {
        const subscription = await Subscription.findById(subId);
        let computedEndDate = new Date(start_date1); // convert string to Date
  
        if (subscription.subscriptionType === "daily") {
          computedEndDate.setDate(computedEndDate.getDate() + 1);
        } else if (subscription.subscriptionType === "weekly") {
          computedEndDate.setDate(computedEndDate.getDate() + 7);
        } else if (subscription.subscriptionType.startsWith("monthly")) {
          computedEndDate.setMonth(computedEndDate.getMonth() + 1);
        }
  
        const userSub = {
          id_user: idUser,
          id_subscription: subId,
          start_date: new Date(start_date1),
          end_date: computedEndDate,
        };
  
        const newUserSub = await UserSubscription.create(userSub);
  
        res.status(200).json({
          status: 'success',
          newUserSub
        });
      }
    } catch (err) {
      console.error("Error in /verify:", err);
      res.status(400).json({
        status: 'fail',
        message: err.message || err
      });
    }
  };
  

exports.getSubscriptionByType = async (req , res) => {
    try{
        // const subscriptions = await Subscription.find().where('roomType').equals(req.params.roomType)
        const subscriptions = await Subscription.find().where('roomType').regex(new RegExp(`^${req.params.roomType}`, 'i'));

        res.json({
            status: 'success',
            results: subscriptions.length,
            subscriptions
        })
    }catch(err){
        res.status(400).json({
            status: 'fail',
            message: err
        })
    }
}
  

// const express=require('express')
// const fs=require('fs')
// const Subscription = require('./../Models/Subscription')
// const UserSubscription=require('./../Models/userSubscription')
// const { fail } = require('assert')

// exports.getAllSubscription=async(req,res)=>{
//     try{
//         const subscriptions=await Subscription.find()
//         res.status(200).json({
//             status:'success',
//             data:{
//                 subscriptions:subscriptions
//             }
//         })
//     }catch{
//         res.status(404).json({
//             status:'fail',
//             data:{
//                 message:'No subscription found'
//             }
//         })
//     }
// }
// exports.updateSubecription=async(req,res)=>{
//     try{
//         const id=req.params.id
//         const updatedSubscription=await Subscription.findByIdAndUpdate(id,req.body,{new:true,
//             runValidators:true})
        
//         res.status(200).json({
//             status:'success',
//             data:{
//                 updatedSubscription:updatedSubscription
//             }
//         })

//     }catch{
//         res.status(404).json({
//             status:'fail',
//             data:{
//                 message:'No subscription found'
//             }
//         })
//     }
// }
// exports.deleteSubscription=async(req,res)=>{
//     try{
//         const id=req.params.id
//         await Subscription.findByIdAndDelete(id)
//         res.status(204).json({
//             status:'success',
//             data:{
//                 message:'Subscription deleted successfully'
//         }})

//     }catch{
//         res.status(404).json({
//             status:fail,
//             data:{
//                 message:'No subscription found'
//             }
//      })
//     }
// }
// exports.addSubscription=async (req,res)=>{
//     try{
//         const subscription= await Subscription.create(req.body)
//         res.status(201).json({  
//             status:'success',
//             data:{
//                 subscription:subscription
//                 }

//         })

//     }catch(err){
//         res.status(400).json({
//             "status": "failed",
//             "message": err
//         })
//     }
// }
// exports.getSubscriptionById=async(req,res)=>{
//     try{
//         const id=req.params.id
//         const subscription=await Subscription.findById(id)
//         res.status(204).json({
//             status:'success',
//             data:{
//                 subscription:subscription}})

//     }catch{
//         res.status(404).json({
//             status:fail,
//             data:{
//                 message:'No subscription found'
//             }
//      })
//     }
// }
// const axios = require('axios')
// exports.getCheckoutSession = async(req , res) => {
//     try{
//         const url = "https://api.sandbox.konnect.network/api/v2/payments/init-payment"

//         const payload =  {
//             receiverWalletId: process.env.WALLET_ID,
//             amount : req.body.amount,
//             description: req.body.description,
//             acceptedPaymentMethods: ["e-DINAR"],
//             successUrl: http://localhost:3000/subPay?status=success&subId=${req.body.subId},
//             failUrl: http://localhost:3000/subPay?status=failed,
//         }

//         const response = await fetch(url , {
//             method: "POST",
//             body: JSON.stringify(payload),
//             headers:{
//                 'Content-Type': 'application/json',
//                 'x-api-key': process.env.API_KEY_KONNECT
//             }
//         })

//         const resData = await response.json()

//         res.status(200).json({
//             status: 'success',
//             result: resData
//         })
//     }catch(err){
//         res.status(400).json({
//             status: 'fail',
//             message: err
//         })
//     }
// }

// exports.verify = async (req , res) => {

//     try{
//         console.log('jjjj')
//         const id_payment = req.params.paymentId
//         console.log(",,"+id_payment)
//         const subId = req.query.subId
//         const idUser = req.query.idUser
//         const start_date = Date.now()
//         // let end_date
//         console.log('subId= ' + subId + 'idUser= ' + idUser)

//         // const url = https://api.sandbox.konnect.network/api/v2/payments/${id_payment}

//         const response = await fetch(https://api.sandbox.konnect.network/api/v2/payments/${id_payment})

//         const resData = await response.json()
//         // console.log("nnn"+resData.transactions[0])
//         console.log('woooooohhh '+resData.payment.transactions[0].status)
//         console.log("hello" + resData.payment.transactions[0].status)
//         if(resData.payment.transactions[0].status === "success"){

//             const subscription = await Subscription.findById(subId)
//             console.log("subscriptio \n")

//             console.log(subscription)

//         const end_date = new Date()

//         if (subscription.subscriptionType === "daily") {
//             // let end_date = new Date();
//             end_date.setDate(end_date.getDate() + 1);
//             console.log("end-date: " + end_date.toISOString());
//         }
//         if(subscription.subscriptionType=="weekly"){
//             end_date.setDate(end_date.getDay()+7);
//             console.log("end-date"+end_date)
//         }
//         if(subscription.subscriptionType.startsWith("monthly")){
//             end_date.setMonth(end_date.getMonth() + 1);
//             console.log("end date"+end_date)
//         } 
              

//             console.log('end_date = ' + end_date.toISOString())

//             const userSub = {
//                 id_user: idUser,
//                 id_subscription: subId,
//                 start_date: start_date,
//                 end_date: end_date,
//             }

//             const newUserSub = await UserSubscription.create(userSub)

//             res.status(200).json({
//                 status: 'success',
//                 newUserSub         
//             })
//         }
//     }catch(err){
//         res.status(400).json({
//             status: 'fail',
//             message: err
//         })
//     }
// }

// exports.getSubscriptionByType = async (req , res) => {
//     try{
//         // const subscriptions = await Subscription.find().where('roomType').equals(req.params.roomType)
//         const subscriptions = await Subscription.find().where('roomType').regex(new RegExp(^${req.params.roomType}, 'i'));

//         res.json({
//             status: 'success',
//             results: subscriptions.length,
//             subscriptions
//         })
//     }catch(err){
//         res.status(400).json({
//             status: 'fail',
//             message: err
//         })
//     }
// }

// const express=require('express')
// const fs=require('fs')
// const Subscription = require('./../Models/Subscription')
// const UserSubscription=require('./../Models/userSubscription')
// const { fail } = require('assert')

// exports.getAllSubscription=async(req,res)=>{
//     try{
//         const subscriptions=await Subscription.find()
//         res.status(200).json({
//             status:'success',
//             data:{
//                 subscriptions:subscriptions
//             }
//         })
//     }catch{
//         res.status(404).json({
//             status:'fail',
//             data:{
//                 message:'No subscription found'
//             }
//         })
//     }
// }
// exports.updateSubecription=async(req,res)=>{
//     try{
//         const id=req.params.id
//         const updatedSubscription=await Subscription.findByIdAndUpdate(id,req.body,{new:true,
//             runValidators:true})
        
//         res.status(200).json({
//             status:'success',
//             data:{
//                 updatedSubscription:updatedSubscription
//             }
//         })

//     }catch{
//         res.status(404).json({
//             status:'fail',
//             data:{
//                 message:'No subscription found'
//             }
//         })
//     }
// }
// exports.deleteSubscription=async(req,res)=>{
//     try{
//         const id=req.params.id
//         await Subscription.findByIdAndDelete(id)
//         res.status(204).json({
//             status:'success',
//             data:{
//                 message:'Subscription deleted successfully'
//         }})

//     }catch{
//         res.status(404).json({
//             status:fail,
//             data:{
//                 message:'No subscription found'
//             }
//      })
//     }
// }
// exports.addSubscription=async (req,res)=>{
//     try{
//         const subscription= await Subscription.create(req.body)
//         res.status(201).json({  
//             status:'success',
//             data:{
//                 subscription:subscription
//                 }

//         })

//     }catch(err){
//         res.status(400).json({
//             "status": "failed",
//             "message": err
//         })
//     }
// }
// exports.getSubscriptionById=async(req,res)=>{
//     try{
//         const id=req.params.id
//         const subscription=await Subscription.findById(id)
//         res.status(204).json({
//             status:'success',
//             data:{
//                 subscription:subscription}})

//     }catch{
//         res.status(404).json({
//             status:fail,
//             data:{
//                 message:'No subscription found'
//             }
//      })
//     }
// }
// const axios = require('axios')
// exports.getCheckoutSession = async(req , res) => {
//     try{
//         const url = "https://api.sandbox.konnect.network/api/v2/payments/init-payment"

//         const payload =  {
//             receiverWalletId: process.env.WALLET_ID,
//             amount : req.body.amount,
//             description: req.body.description,
//             acceptedPaymentMethods: ["e-DINAR"],
//             successUrl: `http://localhost:3000/subPay?status=success&subId=${req.body.subId}&start_date=${req.body.start_date}`,
//             failUrl: `http://localhost:3000/subPay?status=failed`,
//         }

//         const response = await fetch(url , {
//             method: "POST",
//             body: JSON.stringify(payload),
//             headers:{
//                 'Content-Type': 'application/json',
//                 'x-api-key': process.env.API_KEY_KONNECT
//             }
//         })

//         const resData = await response.json()

//         res.status(200).json({
//             status: 'success',
//             result: resData
//         })
//     }catch(err){
//         res.status(400).json({
//             status: 'fail',
//             message: err
//         })
//     }
// }

// exports.verify = async (req , res) => {

//     try{
//         console.log('jjjj')
//         const id_payment = req.params.paymentId
//         console.log(",,"+id_payment)
//         const subId = req.query.subId
//         const idUser = req.query.idUser
//         const start_date = Date.now()
//         // let end_date
//         console.log('subId= ' + subId + 'idUser= ' + idUser)

//         // const url = https://api.sandbox.konnect.network/api/v2/payments/${id_payment}

//         const response = await fetch(`https://api.sandbox.konnect.network/api/v2/payments/${id_payment}`)

//         const resData = await response.json()
//         // console.log("nnn"+resData.transactions[0])
//         console.log('woooooohhh '+resData.payment.transactions[0].status)
//         console.log("hello" + resData.payment.transactions[0].status)
//         if(resData.payment.transactions[0].status === "success"){

//             const subscription = await Subscription.findById(subId)
//             console.log("subscriptio \n")

//             console.log(subscription)

//         const end_date = new Date()

//         if (subscription.subscriptionType === "daily") {
//             // let end_date = new Date();
//             end_date.setDate(end_date.getDate() + 1);
//             console.log("end-date: " + end_date.toISOString());
//         }
//         if(subscription.subscriptionType=="weekly"){
//             end_date.setDate(end_date.getDay()+7);
//             console.log("end-date"+end_date)
//         }
//         if(subscription.subscriptionType.startsWith("monthly")){
//             end_date.setMonth(end_date.getMonth() + 1);
//             console.log("end date"+end_date)
//         } 
              

//             console.log('end_date = ' + end_date.toISOString())

//             const userSub = {
//                 id_user: idUser,
//                 id_subscription: subId,
//                 start_date: start_date,
//                 end_date: end_date,
//             }

//             const newUserSub = await UserSubscription.create(userSub)

//             res.status(200).json({
//                 status: 'success',
//                 newUserSub         
//             })
//         }
//     }catch(err){
//         res.status(400).json({
//             status: 'fail',
//             message: err
//         })
//     }
// }

// exports.getSubscriptionByType = async (req , res) => {
//     try{
//         // const subscriptions = await Subscription.find().where('roomType').equals(req.params.roomType)
//         const subscriptions = await Subscription.find().where('roomType').regex(new RegExp(`^${req.params.roomType}`, 'i'));

//         res.json({
//             status: 'success',
//             results: subscriptions.length,
//             subscriptions
//         })
//     }catch(err){
//         res.status(400).json({
//             status: 'fail',
//             message: err
//         })
//     }
// }
  