import 'socket.io';

declare module 'socket.io' {
  interface Socket {
    user_id: string;
    user_email: string;
    username: string;
  }
}
