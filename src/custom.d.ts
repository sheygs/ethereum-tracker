declare namespace Express {
  export interface Request {
    user_id: string;
    user_email: string;
    username: string;
  }
}
declare module 'migrate' {}
