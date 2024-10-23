import { serve } from "@hono/node-server";
import { Hono } from "hono";
import type { Context } from "hono";
import { cors } from "hono/cors";

import { authorizeUser } from "./middleware/authorizeUser";
import routes from "./routers/authRoutes";

const app = new Hono();

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.use(authorizeUser);
app.route("/", routes);
app.get("/", (c: Context) => c.text("api is on"));

serve(app);
