exports.handler = async (event) => {
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  try {
    const { amount } = JSON.parse(event.body);
    if (!amount || amount <= 0) {
      return { statusCode: 400, headers, body: JSON.stringify({ error: 'Invalid amount' }) };
    }

    // ⚠️ یہاں دونوں کلیدیں اور والیٹ درج ہیں (تبدیل نہ کریں)
    const CLIENT_ID = "ck_staging_5zqEPWZFLMS1i8guNDB5y6c5Z2WLCeFHJcs8qbTwwM95wM7Uy7Vh7XgAEUKrZJMSGmkRPE37ZQfn414vG8w9ZYmZksyVB93g6ASP8hyFdiCczaHVWFossb9dvvLUPtUackFEh88nMWV1eABxGj2zdcA7tazQKrsBmA3UqkbAw3ALWBeCPJeySnMDAjQdsQQqcNiXoz1hLHymz9axCMn9Vnx3";
    const API_KEY   = "sk_staging_5zqEPWZFLMS1i8guNDB5y6c5Z2WLCeFHJcs8qbTwwM95wM7Uy7Vh7XgAEUKrZJMSGmkRPE37ZQfn414vG8w9ZYmZksyVB93g6ASP8hyFdiCczaHVWFossb9dvvLUPtUackFEh88nMWV1eABxGj2zdcA7tazQKrsBmA3UqkbAw3ALWBeCPJeySnMDAjQdsQQqcNiXoz1hLHymz9axCMn9Vnx3";
    const WALLET    = "0xA328F1903840946B573947D4D311Fd7AF1bB198d";

    // Crossmint کو چیک‌آؤٹ سیشن بنانے کی درخواست
    const response = await fetch("https://staging.crossmint.com/api/2022-06-09/checkout/sessions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-client-secret": CLIENT_ID,
        "x-api-key": API_KEY
      },
      body: JSON.stringify({
        payment: {
          amount: amount.toString(),
          currency: "usdt",
          recipient: {
            walletAddress: WALLET,
            chain: "polygon"
          }
        }
      })
    });

    const data = await response.json();

    if (data.error) {
      throw new Error(data.error.message || "Session creation failed");
    }

    // سیشن URL واپس کریں (Crossmint کا اپنا صفحہ)
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ success: true, checkoutUrl: data.url })
    };

  } catch (error) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: error.message })
    };
  }
};
