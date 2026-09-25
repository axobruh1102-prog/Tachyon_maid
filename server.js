const express = require("express");

const {
  Client,
  GatewayIntentBits
} = require("discord.js");

const TOKEN = process.env.DISCORD_TOKEN;
const PORT = Number(process.env.PORT) || 10000;

if (!TOKEN) {
  console.error("DISCORD_TOKEN is missing!");
  process.exit(1);
}

// ========================================
// EXPRESS
// ========================================

const app = express();

app.get("/", function (req, res) {
  res.status(200).send("Maid Tachyon is alive!");
});

app.listen(PORT, "0.0.0.0", function () {
  console.log("HTTP server running on port " + PORT);
});

// ========================================
// DISCORD
// ========================================

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds
  ]
});

client.once("clientReady", function () {
  console.log("================================");
  console.log("DISCORD BOT ONLINE");
  console.log("Bot: " + client.user.username);
  console.log("Bot ID: " + client.user.id);
  console.log("================================");
});

client.on("error", function (error) {
  console.error("DISCORD ERROR:");
  console.error(error);
});

client.on("shardError", function (error) {
  console.error("DISCORD SHARD ERROR:");
  console.error(error);
});

console.log("Connecting Discord.js...");

client.login(TOKEN)
  .then(function () {
    console.log("Discord.js login promise resolved.");
  })
  .catch(function (error) {
    console.error("DISCORD.JS LOGIN FAILED:");
    console.error(error);
  });
