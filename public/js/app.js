const serverBaseUrl = 'http://localhost:3001';
const token = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjU2MzAxYWM2LWZhZGYtNGU3Zi04YjU5LTQ2NDI5YzAxNjI1MSIsInJvbGUiOiJ1c2VyIiwiZW1haWwiOiJzZWd1bi5la29oQGdtYWlsLmNvbSIsImlhdCI6MTcxNjQ4NjcxMCwiZXhwIjoxNzE2NTczMTEwfQ.wpag0B8UkNznPdjX8ei4znqV3dVRdzn8cDtNvzvMW0A`;

// mock call from client
const socket = io(serverBaseUrl, {
  extraHeaders: {
    Authorization: `Bearer ${token}`,
  },
});

socket.on('connect', () => {
  console.log(`connected: ${socket.id}`);
});

socket.on('message', (user) => {
  console.log(`user with ID: ${user} connected !`);
});

socket.on('connect_error', (error) => {
  console.log(`connection error: ${error.message}`);
});
