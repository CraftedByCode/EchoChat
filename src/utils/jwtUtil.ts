import * as jose from "jose";
import { jwtConf } from "../../config/defaultConf";
import { v4 as uuidv4 } from "uuid";
import type { Context } from "hono";
import { getCookie, setCookie } from "hono/cookie";

const createAccessToken = async (
  username: string,
  email: string,
): Promise<string> => {
  const { signPrivateKey } = jwtConf;

  const token = await new jose.SignJWT({
    username: username,
    email: email,
    iat: Math.floor(Date.now() / 1000),
    jti: uuidv4(),
  })
    .setProtectedHeader({ alg: "ES256" })
    .setIssuedAt()
    .setExpirationTime("15m")
    .sign(signPrivateKey);

  return token;
};

const encryptAccessToken = (accessToken: string) => {
  const { encryptPublicKey } = jwtConf;
  const encryptedJwt = new jose.EncryptJWT({
    accessToken: accessToken,
  })
    .setProtectedHeader({
      alg: "ECDH-ES",
      enc: "A128GCM",
    })
    .encrypt(encryptPublicKey);
  return encryptedJwt;
};

const decryptAccessToken = async (accessToken: string) => {
  const { encryptPrivateKey } = jwtConf;
  const decryptedToken = await jose.jwtDecrypt(accessToken, encryptPrivateKey);
  console.log(decryptedToken.payload.accessToken);
};

const setAccessToken = (c: Context, accessToken: string): void => {
  setCookie(c, "accessToken", accessToken, {
    path: "/",
    sameSite: "none",
    httpOnly: true,
    maxAge: 60 * 2,
    secure: false,
  });
};

const getAccessToken = (c: Context): string => {
  const accessToken = getCookie(c, "accessToken");
  if (!accessToken) {
    console.error("accessToken is missing");
    return "";
  }
  return accessToken;
};

export {
  createAccessToken,
  encryptAccessToken,
  decryptAccessToken,
  setAccessToken,
  getAccessToken,
};
