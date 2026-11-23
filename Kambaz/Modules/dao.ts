import { v4 as uuidv4 } from "uuid";
import type Database from "../Database";

type Module = (typeof Database.modules)[number];
type NewModule = Pick<Module, "name" | "course"> &
  Partial<Pick<Module, "description" | "lessons">>;

export default function ModulesDao(db: typeof Database) {
  function findModulesForCourse(courseId: string) {
    return db.modules.filter((module) => module.course === courseId);
  }

  function createModule(module: NewModule) {
    const newModule = { description: "", lessons: [], ...module, _id: uuidv4() };
    db.modules = [...db.modules, newModule];
    return newModule;
  }

  function deleteModule(moduleId: string) {
    db.modules = db.modules.filter((module) => module._id !== moduleId);
  }

  function updateModule(moduleId: string, moduleUpdates: Partial<Omit<Module, "_id">>) {
    const module = db.modules.find((module) => module._id === moduleId);
    if (!module) return;
    return Object.assign(module, moduleUpdates, { _id: moduleId });
  }

  return { findModulesForCourse, createModule, deleteModule, updateModule };
}
