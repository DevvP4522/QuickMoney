import io from 'socket.io-client';

const socket = io('https://backendofquickmoney.onrender.com', {
  transports: ['websocket'],
  reconnection: true,
  reconnectionAttempts: 5,
});

export default socket;