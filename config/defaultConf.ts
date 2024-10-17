import dotenv from "dotenv";
import * as jose from "jose";
import type { databaseConfig, jwtConfig } from "../src/types";

dotenv.config({ path: ".env" });

const signKeys = await jose.generateKeyPair("ES256");
const encryptKeys = await jose.generateKeyPair("ECDH-ES");

if (!process.env.TURSO_CONNECTION_URL || !process.env.TURSO_AUTH_TOKEN) {
  throw new Error("database ConnectionUrl/AuthenticationToken is missing!");
}

const jwtConf: jwtConfig = {
  signPrivateKey: signKeys.privateKey,
  signPublicKey: signKeys.publicKey,
  encryptPrivateKey: encryptKeys.privateKey,
  encryptPublicKey: encryptKeys.publicKey,
};

const databaseConf: databaseConfig = {
  dbConnectionUrl: process.env.TURSO_CONNECTION_URL,
  dbAuthToken: process.env.TURSO_AUTH_TOKEN,
};

export { jwtConf, databaseConf };
