const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files (frontend)
app.use(express.static(path.join(__dirname, "public")));

// API routes
app.post("/approve", (req, res) => {
  // approve payment logic
  res.send("Approved");
});

app.post("/complete", (req, res) => {
  // complete payment logic
  res.send("Completed");
});

// Catch-all route (for index.html)
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
