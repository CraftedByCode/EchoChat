import { usersTable } from "../db/schema";
import { db } from "../db";
import { eq } from "drizzle-orm";
import * as argon2 from "argon2";

const userExists = async (
  userName: string,
  userEmail: string,
): Promise<boolean> => {
  const username = await db
    .select({ username: usersTable.username })
    .from(usersTable)
    .where(eq(usersTable.username, userName));

  const email = await db
    .select({ email: usersTable.email })
    .from(usersTable)
    .where(eq(usersTable.email, userEmail));

  return username.length > 0 || email.length > 0;
};

const createUser = async (
  username: string,
  email: string,
  password: string,
): Promise<void> => {
  const passwordHashed = await argon2.hash(password);
  await db
    .insert(usersTable)
    .values({ username: username, email: email, password: passwordHashed });
};

const getUser = async (userEmail: string) => {
  const userInfo = await db
    .select({
      username: usersTable.username,
      email: usersTable.email,
    })
    .from(usersTable)
    .where(eq(usersTable.email, userEmail));

  return userInfo[0];
};

const verifyUser = async (
  userEmail: string,
  userPassword: string,
): Promise<boolean> => {
  const userInfo = await db
    .select({
      email: usersTable.email,
      password: usersTable.password,
    })
    .from(usersTable)
    .where(eq(usersTable.email, userEmail));

  if (userInfo.length === 0) {
    return false;
  }

  return await argon2.verify(userInfo[0].password, userPassword);
};

export { userExists, createUser, getUser, verifyUser };
