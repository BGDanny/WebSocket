import express from "express";
// TODO change to https
import * as http from "http";
import { WebSocketServer, WebSocket } from "ws";

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

interface IUserConnection {
    [key: string]: {
        numberOfConnection: number;
        online: boolean;
    }
};

let userConnection: IUserConnection = {};

wss.on("connection", (ws: WebSocket) => {
    console.log(`New client connection from ${ws.url}. User status is default to offline`);
    ws.send("You are now connected to the server");
    let username = "";

    ws.onmessage = (e) => {
        const payload = JSON.parse(e.data.toString());
        if (payload.username) {
            username = payload.username;
            if (!userConnection[username]) {
                userConnection = {
                    ...userConnection,
                    [username]: {
                        numberOfConnection: 1,
                        online: false
                    },
                };
            } else {
                userConnection[username].numberOfConnection++;
            }
        } else if (payload.online !== undefined && userConnection[username].numberOfConnection === 1) {
            userConnection[username].online = payload.online;
        }
        console.log(userConnection);
    }

    ws.onclose = () => {
        console.log("One connection lost");
        if (userConnection[username]) {
            if (!--userConnection[username].numberOfConnection) {
                userConnection[username].online = false;
            }
        }
        console.log(userConnection);
    }

    ws.onerror = (e) => {
        console.log(e.message);
    }
});

server.listen(3000, () => console.log("Server started"));