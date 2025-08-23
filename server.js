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

  try {
    const response = await fetch(`https://api.minepi.com/v2/payments/${paymentId}/approve`, {
      method: "POST",
      headers: {
        Authorization: `Key ${process.env.PI_API_KEY}`,
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error("Approve error:", err);
    res.status(500).send("Error approving payment");
  }
});

// Complete endpoint (Pi Network payment)
app.post("/complete", async (req, res) => {
  const { paymentId } = req.body;

  try {
    const response = await fetch(`https://api.minepi.com/v2/payments/${paymentId}/complete`, {
      method: "POST",
      headers: {
        Authorization: `Key ${process.env.PI_API_KEY}`,
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error("Complete error:", err);
    res.status(500).send("Error completing payment");
  }
});

// Catch-all: serve frontend
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
