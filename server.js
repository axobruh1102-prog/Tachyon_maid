const express = require("express");
const {
  Client,
  GatewayIntentBits,
  REST,
  Routes,
  SlashCommandBuilder
} = require("discord.js");

// =========================
// ENV
// =========================

const TOKEN = process.env.DISCORD_TOKEN;
const CLIENT_ID = process.env.CLIENT_ID;
const PORT = process.env.PORT || 10000;

// =========================
// CHECK ENV
// =========================

if (!TOKEN) {
  console.error("DISCORD_TOKEN is missing!");
  process.exit(1);
}

if (!CLIENT_ID) {
  console.error("CLIENT_ID is missing!");
  process.exit(1);
}

// =========================
// WEB SERVER FOR RENDER
// =========================

const app = express();

app.get("/", (req, res) => {
  res.send("Tachyon Maid is online!");
});

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});

// =========================
// DISCORD CLIENT
// =========================

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds
  ]
});

// =========================
// SLASH COMMANDS
// =========================

const commands = [
  new SlashCommandBuilder()
    .setName("maid")
    .setDescription("Tachyon Maid command")
    .toJSON()
];

// =========================
// REGISTER SLASH COMMANDS
// =========================

async function registerCommands() {
  try {
    console.log("Registering slash commands...");

    const rest = new REST({ version: "10" }).setToken(TOKEN);

    await rest.put(
      Routes.applicationCommands(CLIENT_ID),
      {
        body: commands
      }
    );

    console.log("Slash command /maid registered!");
  } catch (error) {
    console.error("Failed to register slash commands:");
    console.error(error);
  }
}

// =========================
// BOT READY
// =========================

client.once("clientReady", async () => {
  console.log("Bot is online as " + client.user.tag);

  await registerCommands();
});

// =========================
// SLASH COMMAND HANDLER
// =========================

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand()) {
    return;
  }

  if (interaction.commandName === "maid") {
    await interaction.reply("Maid Tachyon reporting!");
  }
});

// =========================
// LOGIN
// =========================

client.login(TOKEN);


