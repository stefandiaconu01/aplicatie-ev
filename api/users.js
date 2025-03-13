import fetch from 'node-fetch'; 
import Constants from "expo-constants";

const MONGO_API_KEY = Constants.expoConfig?.extra?.MONGO_API_KEY;

const DATA_API_URL = `https://eu-central-1.aws.data.mongodb-api.com/app/data-ikloh/endpoint/data/v1/action`;

const API_KEY = MONGO_API_KEY;

const HEADERS = {
  'Content-Type': 'application/json',
  'api-key': API_KEY,
};

// Fetch user data by hardcoded _id
export const fetchUserData = async () => {
  try {
    const response = await fetch(`${DATA_API_URL}/findOne`, {
      method: 'POST',
      headers: HEADERS,
      body: JSON.stringify({
        dataSource: 'CSMS',
        database: 'EV_Phone',
        collection: 'users',
        filter: { _id: { "$oid": "67c98aea0e2430d5b790f11e" } }
      }),
    });

    if (!response.ok) {
      throw new Error(`Error fetching user data: ${response.statusText}`);
    }

    const data = await response.json();
    return data.document;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

// Update user data by hardcoded _id
export const updateUserData = async (field, value) => {
  try {
    const response = await fetch(`${DATA_API_URL}/updateOne`, {
      method: 'POST',
      headers: HEADERS,
      body: JSON.stringify({
        dataSource: 'CSMS',
        database: 'EV_Phone',
        collection: 'users',
        filter: { _id: { "$oid": "67c98aea0e2430d5b790f11e" } },
        update: {
          "$set": { [field]: value }
        }
      }),
    });

    if (!response.ok) {
      throw new Error(`Error updating user data: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (err) {
    console.error(err);
    throw err;
  }
};
