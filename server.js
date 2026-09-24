const express = require("express");

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.send("🧋 Maid Tachyon is alive!");
});

app.post("/discord/events", (req, res) => {
  console.log(req.body);
  res.sendStatus(200);
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
