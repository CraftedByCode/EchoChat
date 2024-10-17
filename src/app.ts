import { Hono } from "hono";
import type { Context } from "hono";
import { cors } from "hono/cors";

import { loginRoute, registerRoute } from "./routes/authRoute.ts";
import { authorizeUser } from "./middleware/authorizeUser.ts";
import routes from "./routers/authRoutes.ts";

const app = new Hono();

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  }),
);

app.use(authorizeUser);
app.route("/", routes);
app.get("/", (c: Context) => c.text("api is on"));

// app.route("/auth/register", registerRoute);
// app.route("/auth/login", loginRoute);

export default {
  port: 3002,
  fetch: app.fetch,
};
