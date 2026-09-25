const express = require("express");
const WebSocket = require("ws");

const TOKEN = process.env.DISCORD_TOKEN;
const PORT = Number(process.env.PORT) || 10000;

console.log("================================");
console.log("GATEWAY CONNECTION TEST");
console.log("================================");

if (!TOKEN) {
  console.error("DISCORD_TOKEN is missing!");
  process.exit(1);
}

const app = express();

app.get("/", function (req, res) {
  res.send("Gateway test server is alive!");
});

app.listen(PORT, "0.0.0.0", function () {
  console.log("HTTP server running on port " + PORT);
});

console.log("Opening Discord Gateway...");

const ws = new WebSocket("wss://gateway.discord.gg/?v=10&encoding=json");

ws.on("open", function () {
  console.log("================================");
  console.log("GATEWAY WEBSOCKET CONNECTED");
  console.log("================================");
});

ws.on("message", function (data) {
  console.log("GATEWAY MESSAGE RECEIVED:");

  try {
    const packet = JSON.parse(data.toString());

    console.log("Opcode: " + packet.op);

    if (packet.op === 10) {
      console.log("DISCORD GATEWAY HELLO RECEIVED!");
      console.log("Render can reach Discord Gateway.");

      ws.close();
    }
  } catch (error) {
    console.error("Failed to parse Gateway message:");
    console.error(error);
  }
});

ws.on("error", function (error) {
  console.error("================================");
  console.error("GATEWAY WEBSOCKET ERROR");
  console.error("================================");
  console.error(error);
});

ws.on("close", function (code, reason) {
  console.log("Gateway connection closed.");
  console.log("Code: " + code);
  console.log("Reason: " + reason.toString());
});

setTimeout(function () {
  console.error("================================");
  console.error("GATEWAY CONNECTION TIMEOUT");
  console.error("================================");
  console.error("No Gateway response after 20 seconds.");
  process.exit(1);
}, 20000);
