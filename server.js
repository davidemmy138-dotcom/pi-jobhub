// server.js
const express = require("express");
const bodyParser = require("body-parser");
const fetch = require("node-fetch");
require("dotenv").config();

const app = express();
app.use(bodyParser.json());

// Your Pi API Key (get it from Pi Developer Portal -> App -> API Key)
const PI_API_KEY = process.env.PI_API_KEY;

// Approve a payment
app.post("/approve", async (req, res) => {
  const { paymentId } = req.body;

  try {
    const response = await fetch(`https://api.minepi.com/v2/payments/${paymentId}/approve`, {
      method: "POST",
      headers: {
        "Authorization": `Key ${PI_API_KEY}`,
        "Content-Type": "application/json"
      }
    });

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("Error approving payment:", error);
    res.status(500).json({ error: "Failed to approve payment" });
  }
});

// Complete a payment
app.post("/complete", async (req, res) => {
  const { paymentId, txid } = req.body;

  try {
    const response = await fetch(`https://api.minepi.com/v2/payments/${paymentId}/complete`, {
      method: "POST",
      headers: {
        "Authorization": `Key ${PI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ txid })
    });

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("Error completing payment:", error);
    res.status(500).json({ error: "Failed to complete payment" });
  }
});

// Test route
app.get("/", (req, res) => {
  res.send("✅ Pi JobHub backend running...");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
