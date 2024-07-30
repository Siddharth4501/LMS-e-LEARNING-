import {Router} from 'express';
import { isLoggedIn,authorizedRoles,authorizeSubscribers } from '../middlewares/auth.middleware.js';
import { getRazorpayApiKey } from '../controllers/payment.controller.js';
import { buySubscription,verifySubscription,cancelSubscription,allPayments } from '../controllers/payment.controller.js';
const router =Router();


router.route('/Razorpay-key')
    .get(isLoggedIn,getRazorpayApiKey);

router.route('/subscribe')
    .post(isLoggedIn,buySubscription)

router.route('/verify')
    .post(isLoggedIn,verifySubscription)

router.route('/unsubscribe')
    .post(isLoggedIn, authorizeSubscribers, cancelSubscription);

router.route('/')
    .get(isLoggedIn,authorizedRoles('ADMIN'),allPayments);

export default router;
