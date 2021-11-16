export interface AuthSession {
  authSessionID: string;
  resourceID: string;
  reason: string;
  status: number;
  requestor: string;
  responder: string;
  requestTimestamp: string;
  responseTimestamp: string;
}
