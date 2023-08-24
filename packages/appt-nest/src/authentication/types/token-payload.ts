export type APIToken = string;
export type RefreshAPIToken = string;

export class RefreshPayload {
  userId: string;
  refreshToken = true;
}

export interface TokenPayload {
  userId: string;
}
