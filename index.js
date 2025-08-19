
// index.js
const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;

// A simple test route
app.get("/", (req, res) => {
  res.send("Hello from Job & Freelance Hub App! 🚀");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
