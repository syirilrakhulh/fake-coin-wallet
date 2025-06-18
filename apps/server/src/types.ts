export interface Env {
  Bindings: { DATABASE_URL: string; WEB_URL: string };
}

export interface WalletSignaturePayload {
  message: string;
  messageHash: string;
  signature: string;
  recovery: number;
}

export interface TransferPayload extends WalletSignaturePayload {
  address: string;
  amount: number;
}
