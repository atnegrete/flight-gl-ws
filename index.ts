import * as path from "path";
import * as express from "express";
import * as serveIndex from "serve-index";
import { createServer } from "http";
import { Server } from "colyseus";
import { monitor } from "@colyseus/monitor";

// Import demo room handlers
import { StateHandlerRoom } from "./rooms/state_handler";

const port = Number(process.env.PORT || 4000);
const app = express();

// Attach WebSocket Server on HTTP Server.
const gameServer = new Server({
  server: createServer(app)
});

// Register StateHandlerRoom as "state_handler"
gameServer.register("state_handler", StateHandlerRoom);

// (optional) attach web monitoring panel
app.use("/colyseus", monitor(gameServer));

gameServer.onShutdown(function() {
  console.log(`game server is going down.`);
});

gameServer.listen(port);
console.log(`Listening on http://localhost:${port}`);
