import fetch from 'node-fetch';

import Constants from "expo-constants";

const MONGO_API_KEY = Constants.expoConfig?.extra?.MONGO_API_KEY;

const DATA_API_URL = `https://eu-central-1.aws.data.mongodb-api.com/app/data-ikloh/endpoint/data/v1/action`;

const API_KEY = MONGO_API_KEY;
//console.log(API_KEY);

const HEADERS = {
  'Content-Type': 'application/json',
  'api-key': API_KEY,
};

export const fetchStations = async () => {
  try {
    const response = await fetch(`${DATA_API_URL}/find`, {
      method: 'POST',
      headers: HEADERS,
      body: JSON.stringify({
        dataSource: 'CSMS',
        database: 'EV_Stations',
        collection: 'stations',
      }),
    });

    if (!response.ok) {
      throw new Error(`Error fetching stations: ${response.statusText}`);
    }

    const data = await response.json();
    return data.documents;
  } catch (err) {
    console.error(err);
    throw err;
  }
};
