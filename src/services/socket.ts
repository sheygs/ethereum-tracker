import { Server, Socket } from 'socket.io';
import { blockChainService as blockChain } from './block';

const initSocketEvents = (io: Server) => {
  return (socket: Socket) => {
    socket.emit('message', `${(socket as any).user}`);

    socket.on('error', (error) => {
      io.emit('error', `socket error:  ${error}`);
    });

    socket.on('subscribe', async (data: { event: string; address: string }) => {
      const { event, address } = data;

      const interval = setInterval(async () => {
        try {
          const { result } = await blockChain.getLatestBlockNumber();

          const transactions = await blockChain.getBlockTransactions(result);

          const response = blockChain.filterCondition(
            transactions,
            address,
            event,
          );

          socket.emit('block', response);
          // callback();
        } catch (error) {
          console.error(`Error fetching block data: ${error}`);
          // callback(error);
        }
      }, 6 * 1000); // 6s delay

      socket.on('disconnect', () => {
        clearInterval(interval);
      });
    });
  };
};

export { initSocketEvents };
