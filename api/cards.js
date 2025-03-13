import fetch from "node-fetch";
import Constants from "expo-constants";

const MONGO_API_KEY = Constants.expoConfig?.extra?.MONGO_API_KEY;
const STRIPE_SECRET_KEY = Constants.expoConfig?.extra?.STRIPE_SECRET_KEY;

const DATA_API_URL = `https://eu-central-1.aws.data.mongodb-api.com/app/data-ikloh/endpoint/data/v1/action`;

const HEADERS = {
  "Content-Type": "application/json",
  "api-key": MONGO_API_KEY,
};

// Delete a card from MongoDB
export const deleteCardFromDatabase = async (cardId) => {
  try {
    const response = await fetch(`${DATA_API_URL}/deleteOne`, {
      method: "POST",
      headers: HEADERS,
      body: JSON.stringify({
        dataSource: "CSMS",
        database: "EV_Phone",
        collection: "cards",
        filter: { _id: { "$oid": cardId } },
      }),
    });

    if (!response.ok) {
      throw new Error(`Error deleting card: ${response.statusText}`);
    }

    return await response.json();
  } catch (err) {
    console.error("Error deleting card:", err);
    throw err;
  }
};

// Fetch all cards stored in MongoDB for a given userId
export const fetchCardsByUser = async () => {
  try {
    const response = await fetch(`${DATA_API_URL}/find`, {
      method: "POST",
      headers: HEADERS,
      body: JSON.stringify({
        dataSource: "CSMS",
        database: "EV_Phone",
        collection: "cards",
        filter: { userId: { $oid: "67c98aea0e2430d5b790f11e" } }, // Hardcoded userId for now
      }),
    });

    if (!response.ok) {
      throw new Error(`Error fetching cards: ${response.statusText}`);
    }

    const data = await response.json();
    return data.documents;
  } catch (err) {
    console.error("Error fetching MongoDB cards:", err);
    throw err;
  }
};

// Fetch payment methods from Stripe for a given customer ID
const fetchStripeCardsFromAPI = async (stripeCustomerId) => {
  try {
    const response = await fetch(
      `https://api.stripe.com/v1/payment_methods?customer=${stripeCustomerId}&type=card`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${STRIPE_SECRET_KEY}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Error fetching Stripe cards: ${response.statusText}`);
    }

    const data = await response.json();
    return data.data; // Returns an array of PaymentMethods
  } catch (error) {
    console.error("Error fetching Stripe cards:", error);
    return [];
  }
};

// Fetch all Stripe cards for a user across multiple stripeCustomerIds
export const fetchAllStripeCardsForUser = async () => {
  try {
    const mongoCards = await fetchCardsByUser();

    if (!mongoCards || mongoCards.length === 0) {
      return [];
    }

    // Extract unique Stripe customer IDs
    const uniqueStripeCustomerIds = [
      ...new Set(
        mongoCards.map((card) => card.stripeCustomerId).filter(Boolean)
      ),
    ];

    if (uniqueStripeCustomerIds.length === 0) {
      console.log("No Stripe Customer IDs found for this user.");
      return [];
    }

    // Fetch Stripe payment methods for each customer ID
    const stripeCardPromises = uniqueStripeCustomerIds.map((id) =>
      fetchStripeCardsFromAPI(id)
    );

    const stripeCardsResults = await Promise.all(stripeCardPromises);

    // Flatten the array of arrays into a single list
    const allStripeCards = stripeCardsResults.flat();
    return allStripeCards;
  } catch (error) {
    console.error("Error fetching all Stripe cards for user:", error);
    return [];
  }
};

// Add card data to MongoDB (only non-sensitive information)
export const addCardToDatabase = async (cardData, isFirstCard = false) => {
  try {
    const response = await fetch(`${DATA_API_URL}/insertOne`, {
      method: "POST",
      headers: HEADERS,
      body: JSON.stringify({
        dataSource: "CSMS",
        database: "EV_Phone",
        collection: "cards",
        document: {
          cardBrand: cardData.cardBrand,
          last4: cardData.last4,
          expMonth: cardData.expMonth,
          expYear: cardData.expYear,
          stripeCustomerId: cardData.stripeCustomerId,
          stripePaymentMethodId: cardData.stripePaymentMethodId,
          isAutocharge: false,
          isMain: isFirstCard, // set isMain true if it's the first card
          userId: { $oid: "67c98aea0e2430d5b790f11e" }, // hardcoded user ID
          addedAt: new Date().toISOString(),
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`Error adding card data: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (err) {
    console.error(err);
    throw err;
  }
};


// Update card data in MongoDB
export const updateCardData = async (cardId, field, value) => {
  try {
    const response = await fetch(`${DATA_API_URL}/updateOne`, {
      method: "POST",
      headers: HEADERS,
      body: JSON.stringify({
        dataSource: "CSMS",
        database: "EV_Phone",
        collection: "cards",
        filter: { _id: { $oid: cardId } },
        update: {
          $set: { [field]: value },
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`Error updating card data: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

// Set all other cards to isMain: false and optionally reset autocharge
export const resetOtherMainCards = async (
  currentCardId = null,
  resetAutocharge = false
) => {
  try {
    const filter = {
      userId: { $oid: "67c98aea0e2430d5b790f11e" },
    };

    if (currentCardId) {
      filter._id = { $ne: { $oid: currentCardId } };
    }

    const updateFields = { isMain: false };
    if (resetAutocharge) {
      updateFields.isAutocharge = false;
    }

    const response = await fetch(`${DATA_API_URL}/updateMany`, {
      method: "POST",
      headers: HEADERS,
      body: JSON.stringify({
        dataSource: "CSMS",
        database: "EV_Phone",
        collection: "cards",
        filter,
        update: {
          $set: updateFields,
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`Error resetting main cards: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (err) {
    console.error(err);
    throw err;
  }
};
