# WebSocket
Proof of concept for WebSocket

The server is deployed on [https://websocket-poc-skip.herokuapp.com/](https://websocket-poc-skip.herokuapp.com/) and you can see the demo page at [https://websocket-poc-skip.herokuapp.com/demo](https://websocket-poc-skip.herokuapp.com/demo). You'll need access to the project on Heroku in order to see the logs on the server. 

# Testing
There's no CORS policy for WebSocket, so the [client page](https://github.com/BGDanny/WebSocket/blob/master/src/client/index.html) should work anywhere. Feel free to test it out, but remember to change the [wsUrl](https://github.com/BGDanny/WebSocket/blob/46410c97c0837f62a715dd3b81e43115c96be616/src/client/index.html#L28) to `ws://websocket-poc-skip.herokuapp.com/`.
