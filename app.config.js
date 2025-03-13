import "dotenv/config";

export default {
  expo: {
    name: "evapp",
    slug: "evapp",
    version: "1.0.0",
    extra: {
      STRIPE_PUBLISHABLE_KEY: process.env.STRIPE_PUBLISHABLE_KEY,
      STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
      MAPBOX_TOKEN: process.env.MAPBOX_TOKEN,
      MONGO_API_KEY: process.env.MONGO_API_KEY,
      MONGO_URI: process.env.MONGO_URI,
      JWT_SECRET: process.env.JWT_SECRET,
    },
  },
};
