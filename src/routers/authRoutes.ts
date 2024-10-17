import { Hono } from "hono";
import { registerRoute, loginRoute } from "../routes/authRoute";

const routes = new Hono()
  .route("/auth/register", registerRoute)
  .route("/auth/login", loginRoute);

export default routes;
