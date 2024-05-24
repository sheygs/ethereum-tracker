const serverBaseUrl = 'http://localhost:3001';
const token = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjU2MzAxYWM2LWZhZGYtNGU3Zi04YjU5LTQ2NDI5YzAxNjI1MSIsInJvbGUiOiJ1c2VyIiwiZW1haWwiOiJzZWd1bi5la29oQGdtYWlsLmNvbSIsImlhdCI6MTcxNjU3NDc0MywiZXhwIjoxNzE2NjYxMTQzfQ.AMVSbcSKwQU_ThyBAloBv_7k7dlPO9X1XjtmaJ6jSY8`;

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

socket.emit('subscribe', {
  event: 'all',
  address: '',
});

socket.on('block', (data) => {
  console.log(`received block data: ${JSON.stringify(data)}`);
});
