const serverBaseUrl = 'http://localhost:3001';

const socket = io(serverBaseUrl, {
  auth: {
    token: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjU2MzAxYWM2LWZhZGYtNGU3Zi04YjU5LTQ2NDI5YzAxNjI1MSIsInJvbGUiOiJ1c2VyIiwiZW1haWwiOiJzZWd1bi5la29oQGdtYWlsLmNvbSIsImlhdCI6MTcxNjQ4NjcxMCwiZXhwIjoxNzE2NTczMTEwfQ.wpag0B8UkNznPdjX8ei4znqV3dVRdzn8cDtNvzvMW0A`,
  },
});

socket.on('connect', () => {
  console.log('Connected to server');
});

socket.on('connect_error', (error) => {
  console.log('Connection error: ', error.message);
});
