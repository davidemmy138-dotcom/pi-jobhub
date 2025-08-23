const express = require("express");
const fetch = require("node-fetch");
const app = express();
app.use(express.json());

const API_KEY = "YOUR_PI_API_KEY"; // paste from Pi Developer Portal

// Approve payment
app.post("/approve-payment", async (req, res) => {
  const { paymentId } = req.body;
  try {
    const response = await fetch(`https://api.minepi.com/v2/payments/${paymentId}/approve`, {
      method: "POST",
      headers: {
        "Authorization": `Key ${API_KEY}`,
        "Content-Type": "application/json"
      }
    });
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Complete payment
app.post("/complete-payment", async (req, res) => {
  const { paymentId, txid } = req.body;
  try {
    const response = await fetch(`https://api.minepi.com/v2/payments/${paymentId}/complete`, {
      method: "POST",
      headers: {
        "Authorization": `Key ${API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ txid })
    });
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(3000, () => console.log("🚀 Server running on http://localhost:3000"));
