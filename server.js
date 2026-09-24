const express = require("express");
const {
  Client,
  GatewayIntentBits,
  REST,
  Routes,
  SlashCommandBuilder
} = require("discord.js");

const app = express();
const PORT = process.env.PORT || 10000;

// =========================
// ENVIRONMENT VARIABLES
// =========================

const TOKEN = process.env.DISCORD_TOKEN;
const CLIENT_ID = process.env.CLIENT_ID;

// =========================
// CHECK ENV
// =========================

if (!TOKEN) {
  console.error("❌ DISCORD_TOKEN is missing!");
  process.exit(1);
}

if (!CLIENT_ID) {
  console.error("❌ CLIENT_ID is missing!");
  process.exit(1);
}

// =========================
// EXPRESS SERVER
// =========================

app.get("/", (req, res) => {
  res.send("Tachyon Maid is online! 🧪");
});

app.listen(PORT, () => {
  console.log(🌐 Server running on port ${PORT});
});

// =========================
// DISCORD CLIENT
// =========================

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

// =========================
// SLASH COMMANDS
// =========================

// Discord slash command names MUST be lowercase.
// So use /maid, NOT /Maid.

const commands = [
  new SlashCommandBuilder()
    .setName("maid")
    .setDescription("Tachyon Maid command")
    .toJSON()
];

// =========================
// REGISTER COMMANDS
// =========================

async function registerCommands() {
  try {
    console.log("🔄 Registering slash commands...");

    const rest = new REST({ version: "10" }).setToken(TOKEN);

    await rest.put(
      Routes.applicationCommands(CLIENT_ID),
      {
        body: commands
      }
    );

    console.log("✅ Slash commands registered successfully!");
  } catch (error) {
    console.error("❌ Failed to register slash commands:");
    console.error(error);
  }
}

// =========================
// BOT READY
// =========================

client.once("clientReady", async () => {
  console.log(🤖 Bot is online as ${client.user.tag});

  await registerCommands();
});

// =========================
// SLASH COMMAND HANDLER
// =========================

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === "maid") {
    await interaction.reply("🧪 Maid Tachyon reporting!");
  }
});

// =========================
// OPTIONAL MESSAGE HANDLER
// =========================

client.on("messageCreate", async (message) => {
  if (message.author.bot) return;

  if (message.content === "!ping") {
    await message.reply("Pong! 🏓");
  }
});

// =========================
// LOGIN
// =========================

client.login(TOKEN);

