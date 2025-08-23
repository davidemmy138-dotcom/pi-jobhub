// server.js
const express = require("express");
const bodyParser = require("body-parser");
const fetch = require("node-fetch");
require("dotenv").config();
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));

// Approve endpoint (Pi Network payment)
app.post("/approve", async (req, res) => {
  const { paymentId } = req.body;

  // Validate input
  if (!paymentId) {
    return res.status(400).json({ error: "Missing paymentId" });
  }

  try {
    const response = await fetch(`https://api.minepi.com/v2/payments/${paymentId}/approve`, {
      method: "POST",
      headers: {
        Authorization: `Key ${process.env.PI_API_KEY}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return res.status(response.status).json({
        error: "Failed to approve payment",
        details: errorData,
      });
    }

    const data = await response.json();
    return res.json(data);
  } catch (err) {
    console.error("Approve error:", err);
    return res.status(500).json({ error: "Error approving payment", details: err.message });
  }
});

// Complete endpoint (Pi Network payment)
app.post("/complete", async (req, res) => {
  const { paymentId, txid } = req.body;

  // Validate required fields
  if (!paymentId) {
    return res.status(400).json({ error: "Missing paymentId" });
  }
  if (!txid) {
    return res.status(400).json({ error: "Missing txid (transaction ID on blockchain)" });
  }

  try {
    const response = await fetch(`https://api.minepi.com/v2/payments/${paymentId}/complete`, {
      method: "POST",
      headers: {
        Authorization: `Key ${process.env.PI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ txid }), // Required by Pi API to complete
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return res.status(response.status).json({
        error: "Failed to complete payment",
        details: errorData,
      });
    }

    const data = await response.json();
    return res.json(data);
  } catch (err) {
    console.error("Complete error:", err);
    return res.status(500).json({ error: "Error completing payment", details: err.message });
  }
});

// Catch-all: serve frontend
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`);
});
