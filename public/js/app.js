let socket = io();

/***
 * Since the client-side (browser app) needs to communicate with
 * the `ethereum-tracker-api` service, and it's running outside
 * of Docker, you should use the host machine's URL
 * i.e. the exposed API service on the host machine which is
 * the mapped port `3001` on the host to port `3000` in the container
 * already defined in the `docker-compose.yml`
 */

const serverBaseUrl = 'http://localhost:3001';

async function getToken() {
  try {
    const response = await fetch(`${serverBaseUrl}/api/v1/auth/token`);

    const { data } = await response.json();

    return data?.token;
  } catch (error) {
    log(`failed to fetch token: ${error}`);
    return null;
  }
}

async function bootstrap() {
  try {
    const token = await getToken();

    if (!token) {
      log('token missing');
      return;
    }

    // mock call from client
    socket = io(serverBaseUrl, {
      extraHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });

    const logElement = document.getElementById('log');
    const transactionsContainer = document.getElementById(
      'transactionsContainer',
    );

    function log(message = '') {
      const logItem = document.createElement('div');

      logItem.className = 'log-item';
      logItem.textContent = message;
      logElement.appendChild(logItem);
      logElement.scrollTop = logElement.scrollHeight;
    }

    function addTransactionCard(transaction = {}) {
      const card = document.createElement('div');

      card.className = 'card transaction-card';

      card.innerHTML = `
        <div class="card-body">
          <p class="card-text"><strong>From:</strong> ${transaction.from}</p>
          <p class="card-text"><strong>To:</strong> ${transaction.to}</p>
          <p class="card-text"><strong>Block Hash:</strong> ${transaction.blockHash}</p>
          <p class="card-text"><strong>Transaction Hash:</strong> ${transaction.hash}</p>
          <p class="card-text"><strong>Block Number:</strong> ${transaction.blockNumber}</p>
          <p class="card-text"><strong>Gas Price:</strong> ${transaction.gasPrice}</p>
          <p class="card-text"><strong>Value:</strong> ${transaction.value}</p>
          <p class="card-text"><strong>LoggedAt:</strong> ${new Date().toISOString()}</p>
        </div>
      `;

      transactionsContainer.appendChild(card);
    }

    function clearTransactionsTable() {
      transactionsContainer.innerHTML = '';
    }

    socket.on('connect', () => log(`Client_ID: ${socket.id} connected ✅`));

    socket.on('message', (user) => log(`User: ${user} 🎉`));

    socket.on('transactions', (data) => {
      log(`Transactions data:- ${JSON.stringify(data)}`);
      clearTransactionsTable();
      data?.results.forEach(addTransactionCard);
    });

    // custom event to get room info
    socket.emit('getRooms');

    // listen for room information
    socket.on('roomsInfo', (rooms) => log(`Joined rooms: ${rooms.join(', ')}`));

    document.getElementById('subscribeButton').addEventListener('click', () => {
      const address = document.getElementById('address').value;
      const eventType = document.getElementById('eventType').value;
      const page = parseInt(document.getElementById('page').value, 10);
      const limit = parseInt(document.getElementById('limit').value, 10);

      const eventPayload = {
        ...(address && { address: address }),
        event_type: eventType,
        ...(page && { page }),
        ...(limit && { limit }),
      };

      socket.emit('subscribe', eventPayload);
      log(`subscribed with payload: ${JSON.stringify(eventPayload)}`);
    });

    document
      .getElementById('unsubscribeButton')
      .addEventListener('click', () => {
        const address = document.getElementById('address').value;
        const eventType = document.getElementById('eventType').value;

        const eventPayload = {
          address: address,
          event_type: eventType,
        };

        socket.emit('unsubscribe', eventPayload);
        log(`unsubscribed with payload: ${JSON.stringify(eventPayload)}`);
      });

    document.getElementById('getRoomsButton').addEventListener('click', () => {
      socket.emit('getRooms');
    });

    socket.on('connect_error', ({ message }) =>
      log(`received connect_error - ${message}`),
    );

    socket.on('error', (error) => log(`received error - ${error}`));
  } catch (error) {
    console.error({ error });
  }
}

bootstrap();
