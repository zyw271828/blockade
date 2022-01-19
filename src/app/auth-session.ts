export interface AuthSession {
  authSessionID: string;
  resourceID: string;
  reason: string;
  status: string;
  requestor: string;
  responder: string;
  requestTimestamp: string;
  responseTimestamp: string;
}
