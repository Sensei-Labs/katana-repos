# Katana Notification Server
Katana notification server is a Websocket for send notification to active users in webapp.

## Understanding the structure
![Diagram](notifications.jpeg)

## Installation
```bash
yarn install
```

## Run
```bash
yarn dev
```

## Usage Client
```javascript
function startSocket() {
  const socket = new WebSocket(NOTIFICATION_SERVER_URL);
  // Connection opened
  socket.addEventListener('open', () => {
    console.log('Websocket connection opened');
    // subscribe to SOL/USDC
    socket.send(JSON.stringify(walletAddress));
  });

  socket.addEventListener('close', () => {
    console.log('Websocket connection closed');
    setTimeout(function () {
      startSocket();
    }, 1000);
  });

  // retry connection
  socket.onerror = function (event) {
    console.error('Socket encountered error closing socket');
    socket.close();
  };

  // response of the server with the price
  socket.addEventListener('message', (event) => {
    console.log('Websocket connection received', event.data);
    // push notification in the UI
  });
}
```

## Deployed

- DEV: ws://katana-notification-server-production.up.railway.app
