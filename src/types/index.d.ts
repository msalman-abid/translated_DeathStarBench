import { Hotel } from "./common";

export {};

declare global {
  namespace Express {
    interface Response {
      Hotels: Hotel[];
    }
  }
}