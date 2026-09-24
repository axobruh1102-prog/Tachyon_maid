const express = require("express");
const {
  Client,
  GatewayIntentBits,
  REST,
  Routes,
  SlashCommandBuilder
} = require("discord.js");

const TOKEN = process.env.DISCORD_TOKEN;
const CLIENT_ID = process.env.CLIENT_ID;
const PORT = process.env.PORT || 10000;

if (!TOKEN) {
  console.error("ERROR: DISCORD_TOKEN is missing!");
  process.exit(1);
}

if (!CLIENT_ID) {
  console.error("ERROR: CLIENT_ID is missing!");
  process.exit(1);
}

console.log("CLIENT_ID loaded:", CLIENT_ID);
console.log("DISCORD_TOKEN loaded:", !!TOKEN);

const app = express();

app.get("/", (req, res) => {
  res.send("Tachyon Maid is online!");
});

app.listen(PORT, () => {
  console.log(Server running on port ${PORT});
});

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds
  ]
});

const maidCommand = new SlashCommandBuilder()
  .setName("maid")
  .setDescription("Tachyon Maid command")
  .toJSON();

async function registerCommands() {
  try {
    console.log("Registering slash commands...");

    const rest = new REST({ version: "10" }).setToken(TOKEN);

    await rest.post(
      Routes.applicationCommands(CLIENT_ID),
      {
        body: maidCommand
      }
    );

    console.log("Slash command /maid registered!");
  } catch (error) {
    console.error("Failed to register slash commands:");
    console.error(error);
  }
}

client.once("clientReady", async () => {
  console.log(Bot is online as ${client.user.tag});
  await registerCommands();
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === "maid") {
    await interaction.reply("Maid Tachyon reporting! 🫡");
  }
});

client.login(TOKEN);


