require("dotenv").config();

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;

const express = require("express");
const Stripe = require("stripe");
const cors = require("cors");

const app = express();
const stripe = new Stripe(
  STRIPE_SECRET_KEY
);
const PORT = 3001;

app.use(cors());
app.use(express.json());

// Endpoint to create a Stripe customer and generate an ephemeral key
app.post("/customer", async (req, res) => {
  try {
    const customer = await stripe.customers.create();
    const ephemeralKey = await stripe.ephemeralKeys.create(
      { customer: customer.id },
      { apiVersion: "2022-11-15" }
    );
    res.json({
      customer: customer.id,
      ephemeralKeySecret: ephemeralKey.secret,
    });
  } catch (error) {
    console.error("Server Error in /customer:", error.message);
    res.status(500).json({ error: "Failed to create customer" });
  }
});

// Endpoint to create a SetupIntent for saving a card
app.post("/create-setup-intent", async (req, res) => {
  try {
    const { customerId } = req.body;

    const setupIntent = await stripe.setupIntents.create({
      customer: customerId,
    });

    res.json({ 
      setupIntent: setupIntent.client_secret, 
      customerId: customerId
    });
  } catch (error) {
    console.error("Error creating setup intent:", error.message);
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server - running on port ${PORT}`);
});
