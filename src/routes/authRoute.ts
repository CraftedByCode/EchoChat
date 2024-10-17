import { Hono } from "hono";
import { registerUser, loginUser } from "../controllers/authController";

const registerRoute = new Hono().post("/", registerUser);
const loginRoute = new Hono().post("/", loginUser);

export { registerRoute, loginRoute };
