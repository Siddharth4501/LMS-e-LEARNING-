import User from "../models/user.model.js"
import crypto from 'crypto';
import AppError from '../utils/error.utils.js';
import { razorpay } from '../server.js';
import Payment from '../models/payment.model.js';

async function processRefund(paymentId) {
  try {
    const refund = await razorpay.payments.refund(paymentId, {
      speed: 'optimum'
    });
    console.log('Refund successful', refund);
  } catch (error) {
    console.error('Refund failed', error);
  }
}

const getRazorpayApiKey=async(req,res,next)=>{
  
    res.status(200).json({
        success:true,
        message:'Razorpay API key',
        key:process.env.RAZORPAY_KEY_ID,
    })
}

const buySubscription=async(req,res,next)=>{
    // Extracting ID from request obj
  const { id } = req.user;

  // Finding the user based on the ID
  const user = await User.findById(id);

  if (!user) {
    return next(new AppError('Unauthorized, please login'));
  }

  // Checking the user role
  if (user.role === 'ADMIN') {
    return next(new AppError('Admin cannot purchase a subscription', 400));
  }

  // Creating a subscription using razorpay that we imported from the server
  const subscription = await razorpay.subscriptions.create({
    
    plan_id: process.env.RAZORPAY_PLAN_ID, // The unique plan ID
    customer_notify: 1, // 1 means razorpay will handle notifying the customer, 0 means we will not notify the customer
    total_count: 12, // 12 means it will charge every month for a 1-year sub.
  });

  // Adding the ID and the status to the user account
  user.subscription.id = subscription.id;
  user.subscription.status = subscription.status;

  // Saving the user object
  await user.save();

  res.status(200).json({
    success: true,
    message: 'subscribed successfully',
    subscription_id: subscription.id,
  });
}

const verifySubscription=async(req,res,next)=>{
  const { id } = req.user;
  const { razorpay_payment_id, razorpay_subscription_id, razorpay_signature }=req.body;

  // Finding the user
  const user = await User.findById(id);

  // Getting the subscription ID from the user object
  const subscriptionId = user.subscription.id;

  // Generating a signature with SHA256 for verification purposes
  // Here the subscriptionId should be the one which we saved in the DB
  // razorpay_payment_id is from the frontend and there should be a '|' character between this and subscriptionId
  // At the end convert it to Hex value
  const generatedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_SECRET)
    .update(`${razorpay_payment_id}|${subscriptionId}`)
    .digest('hex');

  // Check if generated signature and signature received from the frontend is the same or not
  if (generatedSignature !== razorpay_signature) {
    return next(new AppError('Payment not verified, please try again.', 400));
  }

  // If they match create payment and store it in the DB
  await Payment.create({
    razorpay_payment_id,
    razorpay_subscription_id,
    razorpay_signature,
  });

  // Update the user subscription status to active (This will be created before this)
  user.subscription.status = 'active';

  // Save the user in the DB with any changes
  await user.save();

  res.status(200).json({
    success: true,
    message: 'Payment verified successfully',
  });
}

const cancelSubscription=async(req,res,next)=>{
  try{
    const { id } = req.user;
  console.log("i sm",id)
  
  // Finding the user
  const user = await User.findById(id);
  console.log("i sm2")
  // Checking the user role
  if (user.role === 'ADMIN') {
    return next(
      new AppError('Admin does not need to cannot cancel subscription', 400)
    );
  }

  // Finding subscription ID from subscription
  const subscriptionId = user.subscription.id;
  console.log("i sm3")
  // Creating a subscription using razorpay that we imported from the server
  try {
    const subscription = await razorpay.subscriptions.cancel(
      subscriptionId // subscription id
    );
    console.log("i sm4")
    // Adding the subscription status to the user account
    user.subscription.status = subscription.status;
    console.log("i sm5")
    // Saving the user object
    await user.save();
  } catch (error) {
    console.log("i sm6")
    // Returning error if any, and this error is from razorpay so we have statusCode and message built in
    return next(new AppError(error.error.description, error.statusCode));
  }

  // Finding the payment using the subscription ID
  const payment = await Payment.findOne({
    razorpay_subscription_id: subscriptionId,
  });

  console.log("i sm7")

  // Getting the time from the date of successful payment (in milliseconds)
  const timeSinceSubscribed = Date.now() - payment.createdAt;
  console.log(" i sm11")
  // refund period which in our case is 14 days
  const refundPeriod = 14 * 24 * 60 * 60 * 1000;
  console.log("i sm12")
  // Check if refund period has expired or not
  if (refundPeriod <= timeSinceSubscribed) {
    console.log(" i  sm8")
    return next(
      new AppError(
        'Refund period is over, so there will not be any refunds provided.',
        400
      )
    );
  }
  console.log("i sm13",payment.razorpay_payment_id)
  const paymentId=payment.razorpay_payment_id
  // If refund period is valid then refund the full amount that the user has paid
  const result=await processRefund(paymentId)
  // const result=await razorpay.payments.refund(payment.razorpay_payment_id, {
  //   speed: 'optimum', 
  // });
  console.log("i sm9",result)
  user.subscription.id = undefined; // Remove the subscription ID from user DB
  user.subscription.status = undefined; // Change the subscription Status in user DB

  await user.save();
  await payment.remove();
  console.log("i sm10")
  // Send the response
  res.status(200).json({
    success: true,
    message: 'Subscription canceled successfully',
  });
  }catch(e){
    console.log(e)
    return next(new AppError('Failed to cancel payment',400))
  }
}

const allPayments = async (req, res,next) => {
    const { count, skip } = req.query;//in url query
  
    // Find all subscriptions from razorpay
    const allPayments = await razorpay.subscriptions.all({
      count: count ? count : 10, // If count is sent then use that else default to 10
      skip: skip ? skip : 0, // // If skip is sent then use that else default to 0
    });
  
    const monthNames = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];
  
    const finalMonths = {
      January: 0,
      February: 0,
      March: 0,
      April: 0,
      May: 0,
      June: 0,
      July: 0,
      August: 0,
      September: 0,
      October: 0,
      November: 0,
      December: 0,
    };
  
    const monthlyWisePayments = allPayments.items.map((payment) => {
      // We are using payment.start_at which is in unix time, so we are converting it to Human readable format using Date()
      const monthsInNumbers = new Date(payment.start_at * 1000);
  
      return monthNames[monthsInNumbers.getMonth()];
    });
  
    monthlyWisePayments.map((month) => {
      Object.keys(finalMonths).forEach((objMonth) => {
        if (month === objMonth) {
          finalMonths[month] += 1;
        }
      });
    });
  
    const monthlySalesRecord = [];
  
    Object.keys(finalMonths).forEach((monthName) => {
      monthlySalesRecord.push(finalMonths[monthName]);
    });
  
    res.status(200).json({
      success: true,
      message: 'All payments',
      allPayments,
      finalMonths,
      monthlySalesRecord,
    });
}
export {
    getRazorpayApiKey,
    buySubscription,
    cancelSubscription,
    verifySubscription,
    allPayments,
    
}
