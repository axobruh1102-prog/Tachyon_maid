const WebSocket = require("ws");

const TOKEN = process.env.DISCORD_TOKEN;

console.log("================================");
console.log("DISCORD GATEWAY IDENTIFY TEST");
console.log("================================");

if (!TOKEN) {
  console.error("DISCORD_TOKEN is missing!");
  process.exit(1);
}

const ws = new WebSocket(
  "wss://gateway.discord.gg/?v=10&encoding=json"
);

let heartbeatInterval = null;
let connected = false;

ws.on("open", function () {
  console.log("WebSocket connected.");
});

ws.on("message", function (data) {
  const packet = JSON.parse(data.toString());

  console.log("Received Opcode: " + packet.op);

  // Gateway Hello
  if (packet.op === 10) {
    console.log("HELLO received.");

    heartbeatInterval = packet.d.heartbeat_interval;

    console.log(
      "Heartbeat interval: " + heartbeatInterval + "ms"
    );

    // IDENTIFY
    ws.send(JSON.stringify({
      op: 2,
      d: {
        token: TOKEN,
        intents: 1,
        properties: {
          os: "linux",
          browser: "tachyon-maid",
          device: "tachyon-maid"
        }
      }
    }));

    console.log("IDENTIFY packet sent.");
  }

  // Heartbeat request
  if (packet.op === 1) {
    console.log("Heartbeat requested.");

    ws.send(JSON.stringify({
      op: 1,
      d: null
    }));
  }

  // Heartbeat ACK
  if (packet.op === 11) {
    console.log("Heartbeat ACK received.");
  }

  // READY
  if (packet.op === 0 && packet.t === "READY") {
    console.log("================================");
    console.log("DISCORD GATEWAY LOGIN SUCCESS!");
    console.log("================================");

    if (packet.d && packet.d.user) {
      console.log(
        "Bot username: " +
        packet.d.user.username
      );
    }

    connected = true;

    setTimeout(function () {
      ws.close();
    }, 3000);
  }
});

ws.on("error", function (error) {
  console.error("================================");
  console.error("WEBSOCKET ERROR");
  console.error("================================");
  console.error(error);
});

ws.on("close", function (code, reason) {
  if (heartbeatInterval) {
    clearInterval(heartbeatInterval);
  }

  console.log("Gateway closed.");
  console.log("Code: " + code);
  console.log("Reason: " + reason.toString());

  if (!connected) {
    console.error("Gateway login did NOT reach READY.");
  }
});
