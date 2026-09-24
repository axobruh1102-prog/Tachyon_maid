const express = require("express");
const { Client, GatewayIntentBits } = require("discord.js");

const app = express();
const PORT = process.env.PORT || 3000;

// Web server
app.get("/", (req, res) => {
  res.send("🗿 Maid Tachyon is alive!");
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(🌐 Server running on port ${PORT});
});

// Discord bot
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

client.once("ready", () => {
  console.log(🤖 ${client.user.tag} is online!);
});

client.login(process.env.DISCORD_TOKEN);
