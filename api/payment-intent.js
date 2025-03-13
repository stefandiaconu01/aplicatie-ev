// start with:
// node -r dotenv/config payment-intent.js
// or: node payment-intent.js

require("dotenv").config();

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;

const express = require("express");
const Stripe = require("stripe");
const cors = require("cors");

//const fs = require('fs');
//const path = require('path');

const app = express();
const stripe = new Stripe(
  STRIPE_SECRET_KEY
);

app.use(cors());
app.use(express.json());

// Store successful payments
const paymentRecords = {};

app.post("/create-payment-intent", async (req, res) => {

  try {
    const { amount, currency } = req.body;

    console.log(`Received payment request - Amount: ${amount}, Currency: ${currency}`);

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
      setup_future_usage: "on_session",
      //statement_descriptor: "Custom descriptor",
      metadata: {
        order_id: "7777",
      },
      payment_method_types: ["card"],
    });

    // Store the payment intent ID
    paymentRecords[paymentIntent.id] = { amount, currency };
    
    console.log("Created PaymentIntent: ", paymentIntent);  //debugging

    res.json({ paymentIntent: paymentIntent.client_secret, paymentIntentId: paymentIntent.id });
  } catch (error) {
    console.error("Error creating payment intent:", error);
    res.status(500).send("Internal Server Error");
  }
});

// Refund API
app.post("/refund", async (req, res) => {
  try {
    const { paymentIntentId } = req.body;
    let { refundAmount } = req.body;

    if (!paymentRecords[paymentIntentId]) {
      return res.status(400).json({ error: "Invalid Payment Intent ID" });
    }

    refundAmount = Math.round(parseFloat(refundAmount) * 100); 

    const refund = await stripe.refunds.create({
      payment_intent: paymentIntentId,
      amount: refundAmount,
    });

    console.log(`Refunded ${refundAmount / 100} RON for PaymentIntent ${paymentIntentId}`);

    res.json({ success: true, refundId: refund.id });

  } catch (error) {
    console.error("Error processing refund:", error);
    res.status(500).json({ error: "Failed to process refund" });
  }
});

app.listen(3000, '0.0.0.0', () => {
  console.log(`Payment-intent - running on port 3000`);
  //fs.writeFileSync(path.join(__dirname, 'server-ready.tmp'), 'ready');
});