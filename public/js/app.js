let socket = io();
const serverBaseUrl = 'http://localhost:3001';

async function getToken() {
  try {
    const response = await fetch(`${serverBaseUrl}/api/v1/auth/token`);
    const { data } = await response.json();
    // console.log({ data });
    return data?.token;
  } catch (error) {
    console.error('failed to fetch token: ', error);
    return null;
  }
}

async function bootstrap() {
  try {
    const token = await getToken();
    // console.log({ token });

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
      console.log(`client_id: ${socket.id} connected ✅`);
    });

    socket.on('connect_error', (error) => {
      console.log(`error: ${error.message}`);
    });

    socket.on('message', (user) => {
      console.log(`user_id: ${user}`);
    });

    socket.emit('subscribe', {
      event_type: 'all',
      address: '',
      page: 1,
      limit: 5,
    });

    socket.on('transactions', (data) => {
      console.log(`received block transactions: ${JSON.stringify(data)}`);
    });

    // listen for the error event
    socket.on('error', (errorMessage) => {
      console.error('received error: ', errorMessage);
      // Display an error message to the user
      alert(`error: ${errorMessage}`);
    });
  } catch (error) {
    console.error(error);
  }
}

bootstrap();
