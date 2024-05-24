import { Socket as IOSocket } from 'socket.io';

declare module 'socket.io' {
  export interface Socket {
    user: string;
  }
}
