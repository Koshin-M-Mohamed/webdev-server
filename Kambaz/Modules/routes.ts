import type { Express, Request, Response } from "express";
import type Database from "../Database";
import ModulesDao from "./dao";

export default function ModuleRoutes(app: Express, db: typeof Database) {
  const dao = ModulesDao(db);

  const findModulesForCourse = (req: Request<{ courseId: string }>, res: Response) => {
    res.json(dao.findModulesForCourse(req.params.courseId));
  };

  const createModuleForCourse = (req: Request<{ courseId: string }>, res: Response) => {
    const module = { ...req.body, course: req.params.courseId };
    res.json(dao.createModule(module));
  };

  const deleteModule = (req: Request<{ moduleId: string }>, res: Response) => {
    dao.deleteModule(req.params.moduleId);
    res.sendStatus(200);
  };

  const updateModule = (req: Request<{ moduleId: string }>, res: Response) => {
    const module = dao.updateModule(req.params.moduleId, req.body);
    if (!module) {
      res.sendStatus(404);
      return;
    }
    res.json(module);
  };

  app.get("/api/courses/:courseId/modules", findModulesForCourse);
  app.post("/api/courses/:courseId/modules", createModuleForCourse);
  app.delete("/api/modules/:moduleId", deleteModule);
  app.put("/api/modules/:moduleId", updateModule);
}
