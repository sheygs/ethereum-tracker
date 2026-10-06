/* eslint-disable no-undef */
let socket;
const serverBaseUrl = window.location.origin;

async function bootstrap() {
  try {
    const logElement = document.getElementById('logs');
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

    socket = io(serverBaseUrl, { autoConnect: false });
    document
      .getElementById('loginForm')
      .addEventListener('submit', async (event) => {
        event.preventDefault();
        try {
          const response = await fetch(`${serverBaseUrl}/api/v1/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: document.getElementById('email').value,
              password: document.getElementById('password').value,
            }),
          });
          const body = await response.json();
          if (!response.ok || !body.data?.token)
            throw new Error(body.error?.message || 'Login failed');
          socket.disconnect();
          socket.auth = { token: `Bearer ${body.data.token}` };
          socket.connect();
          document.getElementById('password').value = '';
        } catch (error) {
          log(error.message);
        }
      });

    socket.on('connect', () => log(`client_id: ${socket.id} connected ✅`));

    socket.on('message', (user) => log(`user: ${user} 🎉`));

    socket.on('transactions', (data) => {
      log(`transactions data: ${JSON.stringify(data)}`);
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
      log(`received connect_error: ${message}`),
    );

    socket.on('error', (error) =>
      log(`received error: ${error.message || error}`),
    );
  } catch (error) {
    console.error({ error });
  }
}

bootstrap();
