import { defineConfig } from "drizzle-kit";
import { databaseConf } from "./config/defaultConf";

export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./migrations",
  dialect: "sqlite",
  driver: "turso",
  dbCredentials: {
    url: databaseConf.dbConnectionUrl,
    authToken: databaseConf.dbAuthToken,
  },
});
