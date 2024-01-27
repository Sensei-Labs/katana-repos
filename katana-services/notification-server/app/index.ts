import WebSocket from 'ws';

const subscribers: { [key: string]: WebSocket } = {};

function getOrCreateBroadcastInstance(
  socket: WebSocket,
  walletAddress: string,
) {
  subscribers[walletAddress] = socket;
  return subscribers[walletAddress];
}

function getBroadcastInstance(walletAddress: string) {
  return subscribers[walletAddress];
}

export default function runSocket(connection: any) {
  let walletAddress: string;

  connection.socket.on('open', async (input: string) => {
    walletAddress = input.toString();
    console.log('Opened: %s', walletAddress);

    if (!walletAddress) return;

    getOrCreateBroadcastInstance(connection.socket, walletAddress);
  });

  connection.socket.on('message', async (input: string) => {
    walletAddress = input.toString();
    console.log('Opened: %s', walletAddress);
    if (!walletAddress) return;
    getOrCreateBroadcastInstance(connection.socket, walletAddress);
  });

  connection.socket.on('close', async () => {
    if (!walletAddress) return;
    try {
      delete subscribers[walletAddress];
    } catch (error) {
      console.log(error);
    }
  });
}

export const createNotificationForWallet = async (
  walletAddress: string,
  data: Record<string, any>,
) => {
  const client = getBroadcastInstance(walletAddress);

  if (client) {
    client.send(JSON.stringify(data));
  }
};

export const createNotificationForAllUsers = async (
  data: Record<string, any>,
) => {
  Object.values(subscribers).forEach((client) => {
    client.send(JSON.stringify(data));
  });
};
