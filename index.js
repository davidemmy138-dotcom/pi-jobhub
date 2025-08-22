const express = require("express");
const path = require("path");
const app = express();

// ✅ Serve static files from the root folder
app.use(express.static(path.join(__dirname)));

// Example route (you can keep your own existing ones)
app.get("/", (req, res) => {
  res.send("Welcome to Pi JobHub!");
});

// ✅ Make sure Render listens on the provided port
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
