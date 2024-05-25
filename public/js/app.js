let socket = io();
const serverBaseUrl = 'http://localhost:3001';

async function getToken() {
  try {
    const response = await fetch(`${serverBaseUrl}/api/v1/auth/token`);
    const { data } = await response.json();
    return data?.token;
  } catch (error) {
    console.error('failed to fetch token: ', error);
    return null;
  }
}

async function bootstrap() {
  try {
    const token = await getToken();

    if (!token) {
      console.log('failed to fetch token');
      return;
    }

    // mock call from client
    socket = io(serverBaseUrl, {
      extraHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });

    socket.on('connect', () => {
      console.log(`client with ID: ${socket.id} connected ✅`);
    });

    socket.on('message', (user) => {
      console.log(`user_id: ${user}`);
    });

    socket.on('connect_error', (error) => {
      console.log(`Error: ${error.message}`);
    });

    socket.emit('subscribe', {
      event: 'all',
      address: '',
    });

    socket.on('block', (data) => {
      console.log(`received block data: ${JSON.stringify(data)}`);
    });
  } catch (error) {
    console.error(error);
  }
}

bootstrap();
