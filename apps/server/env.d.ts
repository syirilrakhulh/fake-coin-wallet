declare global {
  namespace NodeJS {
    interface ProcessEnv {
      DATABASE_URL: string;
      WEB_URL: string;
    }
  }
}

export {};
