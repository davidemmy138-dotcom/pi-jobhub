const path = require("path");

// Serve static files with debug logging
app.use(express.static(path.join(__dirname, "public"), {
  extensions: ['html'] // Try to serve .html if no extension
}));

// Add catch-all route for debugging
app.get("*", (req, res) => {
  console.log(`Serving ${req.url} from ${path.join(__dirname, "public", "index.html")}`);
  res.sendFile(path.join(__dirname, "public", "index.html"));
});
