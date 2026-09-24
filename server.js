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
const express = require("express");
const { Client, GatewayIntentBits } = require("discord.js");

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.send("🗿 Maid Tachyon is alive!");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(Server running on port ${PORT});
});

// Discord Bot
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

client.once("ready", () => {
  console.log(🤖 Logged in as ${client.user.tag});
});

client.login(process.env.DISCORD_TOKEN);
