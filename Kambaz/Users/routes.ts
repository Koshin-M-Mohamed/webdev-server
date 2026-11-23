import type { Express, NextFunction, Request, Response } from "express";
import type Database from "../Database";
import UsersDao, { type User } from "./dao";

declare module "express-session" {
  interface SessionData {
    currentUser?: User;
  }
}

export default function UserRoutes(app: Express, db: typeof Database) {
  const dao = UsersDao(db);

  const signin = (req: Request, res: Response) => {
    const { username, password } = req.body;
    const currentUser = dao.findUserByCredentials(username, password);
    if (!currentUser) {
      res.status(401).json({ message: "Unable to login. Try again later." });
      return;
    }
    req.session.currentUser = currentUser;
    res.json(currentUser);
  };

  const signup = (req: Request, res: Response) => {
    const user = dao.findUserByUsername(req.body.username);
    if (user) {
      res.status(400).json({ message: "Username already in use" });
      return;
    }

    const currentUser = dao.createUser(req.body);
    req.session.currentUser = currentUser;
    res.json(currentUser);
  };

  const updateUser = (req: Request<{ userId: string }>, res: Response) => {
    const userId = req.params.userId;
    dao.updateUser(userId, { ...req.body, _id: userId });
    const updatedUser = dao.findUserById(userId);
    if (updatedUser && req.session.currentUser?._id === userId) {
      req.session.currentUser = updatedUser;
    }
    res.json(updatedUser);
  };

  const profile = (req: Request, res: Response) => {
    const { currentUser } = req.session;
    if (!currentUser) {
      res.sendStatus(401);
      return;
    }
    res.json(currentUser);
  };

  const signout = (req: Request, res: Response, next: NextFunction) => {
    req.session.destroy((error) => {
      if (error) {
        next(error);
        return;
      }
      res.sendStatus(200);
    });
  };

  app.post("/api/users/signup", signup);
  app.post("/api/users/signin", signin);
  app.post("/api/users/signout", signout);
  app.get("/api/users/profile", profile);
  app.put("/api/users/:userId", updateUser);
}
