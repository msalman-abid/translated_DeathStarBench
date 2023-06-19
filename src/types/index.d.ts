import { Hotel__Output } from "../../proto/profile/Hotel";

export {};

declare global {
  namespace Express {
    interface Response {
      Hotels: Hotel__Output[];
    }
  }
}