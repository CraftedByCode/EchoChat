import { createMiddleware } from "hono/factory";
import { getAccessToken, decryptAccessToken } from "../utils/jwtUtil";

export const authorizeUser = createMiddleware(async (c, next) => {
  const accessToken = getAccessToken(c);
  if (accessToken) decryptAccessToken(accessToken);
  await next();
});
