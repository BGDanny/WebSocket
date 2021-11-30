import express from "express";
import * as http from "http";
import { WebSocketServer } from "ws";

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });
const port = process.env.PORT || 3000;

interface IUserConnection {
    [key: string]: {
        numberOfConnection: number;
        online: boolean;
    }
};

let userConnection: IUserConnection = {};

wss.on("connection", (ws, req) => {
    console.log(`New client connection from ${req.headers.origin}. User status is default to offline`);
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