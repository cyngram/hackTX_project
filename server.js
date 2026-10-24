//loads express + node's path tools
const express = require('express');
const path = require("path");
const app = express();

//sends json response to the /api/hello endpoint
app.get("/api/hello", (req, res) => {
  res.json({ message: "server works!" });
});

//chedks if file exists
app.use(express.static(path.join(__dirname, "client/dist")));

//sends files
app.use((req, res) => {
    res.sendFile(path.join(__dirname, "client/dist", "index.html"));
})

//renders the server on port 3000 or the port specified in the environment variables
app.listen(process.env.PORT || 3000, () => console.log("running"));