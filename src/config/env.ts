// config/env.ts
import * as dotenv from "dotenv";
import * as path from "path";
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

export const config = {
  port: process.env.PORT,
  host: process.env.HOST,
  jwtTokenAdmin: process.env.JWT_TOKEN_ADMIN,
  apiSecretTokenKey: process.env.API_SECRET_TOKEN_KEY,
  typeEndPoint: process.env.TYPE_ENDPOINT,
  typeFirtsRequest: process.env.TYPE_FIRST_REQUEST,
  typeSecondRequest: process.env.TYPE_SECOND_REQUEST,
  typeFourthRequest: process.env.TYPE_FOURTH_REQUEST,
};
