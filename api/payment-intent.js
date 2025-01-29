const express = require("express");
const Stripe = require("stripe");
const cors = require("cors");

const app = express();
const stripe = new Stripe(
  "sk_test_51QhSjJP7xXDP0ztowicSvxT79mU7GsVdhKlGKHouhY82722PYGvyo5WLQarLjn4MII2JXM92Jw8PkwlKKnZtzEpJ00uOTlloKw"
);

app.use(cors());
app.use(express.json());

app.post("/create-payment-intent", async (req, res) => {
  //console.log("Request received:", req.body);
  try {
     const { amount, currency } = req.body;
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
      //   automatic_payment_methods: {
      //     enabled: true,
      //   },
      setup_future_usage: "on_session",
      //statement_descriptor: "Custom descriptor",
      metadata: {
        order_id: "777",
      },
      payment_method_types: ["card"],
    });
    console.log("Created PaymentIntent: ", paymentIntent);  // Log for debugging
    res.json({ paymentIntent: paymentIntent.client_secret });

  } catch (error) {
    console.error("Error creating payment intent:", error);
    res.status(500).send("Internal Server Error");
  }
});

// const PORT = 3000;
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });

app.listen(3000, '0.0.0.0', () => {
    console.log(`Server running on port 3000`);
  });