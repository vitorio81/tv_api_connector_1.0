import { JwtPayload } from "jsonwebtoken";

declare global {
  namespace Express {
    interface Request {
      admin?: JwtPayload & {
        id: string;
        email: string;
        username: string;
      };
    }
  }
}
