import express from "express";
import * as http from "http";
import { WebSocketServer } from "ws";
import { v4 as uuidv4 } from 'uuid';

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });
const port = process.env.PORT || 3000;

interface IUserConnection {
    [key: string]: {
        online: boolean;
        onlineTabIds: Array<string>;
    }
};

let userConnection: IUserConnection = {};

wss.on("connection", (ws, req) => {
    console.log(`New client connection from ${req.headers.origin}. User status is default to offline`);
    ws.send("You are now connected to the server");
    let username = "";
    const sessionId = uuidv4();

    const evaluateUserOffline = () => {
        const index = userConnection[username].onlineTabIds.indexOf(sessionId);
        if (index !== -1) {
            userConnection[username].onlineTabIds.splice(index, 1);
        }
        if (!userConnection[username].onlineTabIds.length) {
            userConnection[username].online = false;
        }
    }

    ws.onmessage = (e) => {
        const payload = JSON.parse(e.data.toString());
        if (payload.username) {
            username = payload.username;
            if (!userConnection[username]) {
                userConnection = {
                    ...userConnection,
                    [username]: {
                        online: false,
                        onlineTabIds: [],
                    },
                };
            }
        } else if (payload.online === true) {
            userConnection[username].onlineTabIds.push(sessionId);
            userConnection[username].online = true;
        } else if (payload.online === false) {
            evaluateUserOffline();
        }
        console.log(userConnection);
    }

    ws.onclose = () => {
        console.log("One connection lost");
        if (userConnection[username]) {
            evaluateUserOffline();
        }
        console.log(userConnection);
    }

    ws.onerror = (e) => {
        console.log(e.message);
    }
});

app.get("/demo", (req, res) => {
    res.sendFile("index.html", { root: `${__dirname}/../client` });
})

server.listen(port, () => console.log(`Server started on ${port}`));

// Only used to prevent Heroku from going idle
setInterval(() => {
    wss.clients.forEach((client) => {
        client.send(new Date().toTimeString());
    });
}, 10000);