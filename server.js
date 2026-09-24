const express = require("express");
const {
  Client,
  GatewayIntentBits
} = require("discord.js");

// =========================
// WEB SERVER
// =========================

const app = express();
const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("🗿 Maid Tachyon is alive!");
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(🌐 Server running on port ${PORT});
});

// =========================
// DISCORD BOT
// =========================

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

// Khi bot đăng nhập thành công
client.once("ready", () => {
  console.log(🤖 ${client.user.tag} is online!);
});

// Test command
client.on("messageCreate", (message) => {
  if (message.author.bot) return;

  if (message.content === "!ping") {
    message.reply("🏓 Pong! Maid Tachyon đang sống!");
  }
});

// Đăng nhập Discord bằng token trong Render
client.login(process.env.DISCORD_TOKEN);
