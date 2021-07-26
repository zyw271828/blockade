export interface Auth {
  resourceID: string,
  authSessionID: string,
  reason: string,
  status: number,
  requestor: string,
  responder: string,
  requestTimestamp: string,
  reqsponseTimestamp: string
}

export interface Identity {
  identity: string;
  identityType: string;
  result: string;
}

export interface RequestResult {
  transactionID: string;
}

export interface QueryResult {
  IDs: string[];
  bookmark: string;
}
