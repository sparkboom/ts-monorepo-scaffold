// Types
export interface Token {
  jwt: string;
  expiryTimeStamp: number;
}

export interface Api {
  token: Token | null;
}

// Guards
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const isToken = (token: any): token is Token =>
  token && typeof token === 'object' && typeof token.jwt === 'string' && typeof token.expiryTimeStamp === 'number';
