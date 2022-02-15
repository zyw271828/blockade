export interface AuthSession {
  authSessionId: string;
  resourceId: string;
  reason: string;
  status: string;
  requestor: string;
  responder: string;
  requestTimestamp: string;
  responseTimestamp: string;
}
