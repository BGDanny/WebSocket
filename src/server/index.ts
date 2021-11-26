import express from "express";
import * as http from "http";
import { WebSocketServer, WebSocket } from "ws";

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

wss.on("connection", (ws: WebSocket) => {
    console.log("New client connection");
    ws.send("You are now connected to the server");

    // ws.on("message", (message) => {
    //     console.log(message);
    // });

    ws.onmessage = (e) => {
        console.log(e.data);
    }
});

server.listen(3000, () => console.log("Server started"));