import { Socket as ISocket } from 'socket.io';

declare module 'socket.io' {
  export interface ISocket {
    user: string;
  }
}
