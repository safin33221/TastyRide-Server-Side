const express = require("express");
require("dotenv").config();
const cors = require("cors");
const connectDB = require("./utils/db");
const SSLCommerzPayment = require("sslcommerz-lts");
const jwt = require('jsonwebtoken')


const app = express();
const port = process.env.PORT || 8000;

const authRoutes = require('./routes/authRoutes');
const foodRoutes = require('./routes/foodRoutes');
const adRoutes = require('./routes/adRoutes');
const chatBotRoutes = require('./routes/chatBotRoutes');
const cartRoutes = require('./routes/cartRoutes');
const orderRoutes = require('./routes/orderRoutes');
const notification = require('./routes/notification');
const reviewRoutes = require('./routes/reviewRoutes');
const riderRoutes = require('./routes/riderRoute')

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Parse POST data from SSLCommerz

//Create json web Token
app.post('/jwt', async (req, res) => {
  const userinfo = req.body;
  const token = jwt.sign(userinfo, process.env.JSON_SECRET_KEY, { expiresIn: '23h' })
  res.send(token)
})

// Mongoose
connectDB();
app.use('/api', authRoutes);
app.use('/api', foodRoutes);
app.use('/api', adRoutes);
app.use('/api', chatBotRoutes);
app.use('/api', cartRoutes);
app.use('/api', orderRoutes);
app.use('/api', notification);
app.use('/api', reviewRoutes);
app.use('/api', riderRoutes)

// SSLCommerz configuration
const store_id = process.env.STORE_ID; // Your Store ID from SSLCommerz
const store_passwd = process.env.STORE_PASSWD; // Your Store Password
const is_live = false; // Set to true for live environment, false for sandbox

// Initialize payment
app.post('/init-payment', async (req, res) => {
  const {
    total_amount,
    cus_name,
    cus_email,
    cus_phone,
    cus_country,
    cus_add1,
    cus_city,
  } = req.body;

  // Generate a unique transaction ID (you can use UUID or a custom logic)
  const tran_id = `TRANS_${Date.now()}`;

  const data = {
    total_amount, // Amount from frontend (e.g., 100.00)
    currency: 'BDT', // Currency (Bangladeshi Taka)
    tran_id, // Unique transaction ID
    success_url: 'http://localhost:8000/success', // Success callback URL
    fail_url: 'http://localhost:8000/fail', // Failure callback URL
    cancel_url: 'http://localhost:8000/cancel', // Cancellation callback URL
    ipn_url: 'http://localhost:8000/ipn', // Instant Payment Notification URL
    shipping_method: 'NO',
    product_name: 'Order',
    product_category: 'General',
    product_profile: 'general',
    cus_name, // Customer name from frontend
    cus_email, // Customer email
    cus_add1,
    cus_city,
    cus_country,
    cus_phone, // Customer phone
  };

  try {
    const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live);
    const apiResponse = await sslcz.init(data);
    res.json({ GatewayPageURL: apiResponse.GatewayPageURL });
  } catch (error) {
    console.error('Payment initiation failed:', error);
    res.status(500).json({ error: 'Failed to initiate payment' });
  }
});

// Success callback
app.post('/success', async (req, res) => {
  const paymentData = req.body; // Capture all payment data
  const { tran_id, val_id, amount, currency, status, tran_date } = paymentData;

  // Optional: Validate the transaction
  const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live);
  const validation = await sslcz.validate({ val_id });

  if (validation.status === 'VALID') {
    console.log('Payment successful:', {
      tran_id,
      amount,
      currency,
      tran_date,
    });
    // Redirect to frontend with query parameters
    const redirectUrl = `http://localhost:5173/success?tran_id=${tran_id}&amount=${amount}&currency=${currency}&tran_date=${tran_date}`;
    res.redirect(redirectUrl);
  } else {
    res.redirect('http://localhost:5173/fail');
  }
});

// Fail callback
app.post('/fail', (req, res) => {
  console.log('Fail callback data:', req.body);
  res.redirect('http://localhost:5173/fail');
});

// Cancel callback
app.post('/cancel', (req, res) => {
  console.log('Cancel callback data:', req.body);
  res.redirect('http://localhost:5173/cancel');
});

// IPN endpoint
app.post('/ipn', (req, res) => {
  console.log('IPN data:', req.body);
  res.status(200).send('IPN received');
});

// Root route
app.get('/', async (req, res) => {
  res.send('Tasty food application running successfully with Gemini AI!');
});

app.listen(port, () => {
  console.log(`TastyRide running on ${port}`);
});
