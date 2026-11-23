import { v4 as uuidv4 } from "uuid";
import type Database from "../Database";

export type User = (typeof Database.users)[number] & { dob?: string };

export default function UsersDao(db: typeof Database) {
  let { users }: { users: User[] } = db;

  const findUserByCredentials = (username: string, password: string) =>
    users.find((user) => user.username === username && user.password === password);

  const createUser = (user: Omit<User, "_id">) => {
    const newUser = { ...user, _id: uuidv4() };
    users = [...users, newUser];
    return newUser;
  };

  const findUserByUsername = (username: string) =>
    users.find((user) => user.username === username);

  const findUserById = (userId: string) =>
    users.find((user) => user._id === userId);

  const updateUser = (userId: string, user: User) =>
    (users = users.map((u) => (u._id === userId ? user : u)));

  return {
    findUserByCredentials,
    createUser,
    findUserByUsername,
    findUserById,
    updateUser,
  };
}
