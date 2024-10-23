import type { Context } from "hono";

import {
  createUser,
  getUser,
  userExists,
  verifyUser,
} from "../services/userService";
import validateForm from "../validators/authValidator";
import {
  createAccessToken,
  encryptAccessToken,
  setAccessToken,
} from "../utils/jwtUtil";

const registerUser = async (c: Context) => {
  try {
    const data = await c.req.json();

    if (!data || !data.username || !data.email || !data.password) {
      return c.json({ message: "Required Feilds are missing!" });
    }

    const form = await validateForm(data);

    if (form.success) {
      const validatedData = form.data;

      const { username, email, password } = validatedData;

      if (
        typeof username !== "string" ||
        typeof email !== "string" ||
        typeof password !== "string"
      ) {
        return c.json({ message: "Missing or invalid required fields" }, 400);
      }

      if (await userExists(username, email)) {
        return c.json({ message: "username or email is already exist!" }, 409);
      }

      await createUser(username, email, password);

      return c.json(
        { message: `Successfully registered as a ${username}` },
        201
      );
    } else {
      return c.json(
        {
          message: "unprocessable entity",
        },
        422
      );
    }
  } catch (e) {
    console.error("Error occurs during the registration", e);

    return c.json({ error: "Internal server error" }, 500);
  }
};

const loginUser = async (c: Context) => {
  const form = await validateForm(await c.req.json());
  try {
    if (form.success) {
      const { email, password } = form.data;
      if (await verifyUser(email, password)) {
        const userInfo = await getUser(email);

        const accessToken = await createAccessToken(
          userInfo.username,
          userInfo.email
        );
        const encryptedAccessToken = await encryptAccessToken(accessToken);

        setAccessToken(c, encryptedAccessToken);

        return c.json({}, 204);
      } else {
        return c.json(
          {
            message: "email or password is invalid!",
          },
          403
        );
      }
    } else {
      return c.json(form.errors[1], 422);
    }
  } catch (e) {
    console.error(e as string);
  }
};

export { registerUser, loginUser };
