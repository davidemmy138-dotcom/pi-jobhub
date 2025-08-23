// server.js
const express = require("express");
const bodyParser = require("body-parser");
const fetch = require("node-fetch");
const crypto = require("crypto");
require("dotenv").config();
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// Parse JSON globally (except for webhook, which needs raw body)
app.use(bodyParser.json({ limit: "5mb" }));

// Webhook verification middleware
const verifyPiWebhook = (req, res, buf, encoding) => {
  const signature = req.headers["pi-signature"];
  if (!signature) return res.status(401).json({ error: "Missing Pi-Signature" });

  const expected = crypto
    .createHmac("sha256", process.env.PI_WEBHOOK_SECRET)
    .update(buf.toString("utf8"))
    .digest("hex");

  if (signature !== expected) {
    console.warn("Invalid signature:", { expected, received: signature });
    return res.status(401).json({ error: "Invalid signature" });
  }
};

// Apply verification only to /webhook (with raw body)
app.use("/webhook", bodyParser.json({ verify: verifyPiWebhook, limit: "5mb" }));

// Serve static files (frontend)
app.use(express.static(path.join(__dirname, "public")));

// --- APPROVE PAYMENT ---
app.post("/approve", async (req, res) => {
  const { paymentId } = req.body;
  if (!paymentId) return res.status(400).json({ error: "Missing paymentId" });

  try {
    const response = await fetch(`https://api.minepi.com/v2/payments/${paymentId}/approve`, {
      method: "POST",
      headers: {
        Authorization: `Key ${process.env.PI_API_KEY}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      return res.status(response.status).json({ error: "Approve failed", details: error });
    }

    res.json(await response.json());
  } catch (err) {
    console.error("Approve error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// --- COMPLETE PAYMENT ---
app.post("/complete", async (req, res) => {
  const { paymentId, txid } = req.body;
  if (!paymentId) return res.status(400).json({ error: "Missing paymentId" });
  if (!txid) return res.status(400).json({ error: "Missing txid" });

  try {
    const response = await fetch(`https://api.minepi.com/v2/payments/${paymentId}/complete`, {
      method: "POST",
      headers: {
        Authorization: `Key ${process.env.PI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ txid }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      return res.status(response.status).json({ error: "Complete failed", details: error });
    }

    res.json(await response.json());
  } catch (err) {
    console.error("Complete error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// --- WEBHOOK RECEIVER ---
app.post("/webhook", (req, res) => {
  const event = req.body;
  if (!event.type || !event.data) return res.status(400).json({ error: "Invalid event" });

  console.log("🔔 Webhook:", event.type, "→", event.data.identifier);

  switch (event.type) {
    case "payment_created":
      console.log("🛒 Created:", event.data.amount, "Pi");
      break;
    case "payment_approved":
      console.log("✅ Approved! You can now complete after sending tx.");
      // In production: trigger blockchain transaction here
      break;
    case "payment_canceled":
      console.log("❌ Canceled");
      break;
    case "payment_failed":
      console.log("💥 Failed on blockchain");
      break;
    default:
      console.log("ℹ️ Unknown:", event.type);
  }

  res.status(200).json({ received: true });
});

// --- CATCH-ALL: Serve frontend ---
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
