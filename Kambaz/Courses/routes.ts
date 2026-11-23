import type { Express, Request, Response } from "express";
import type Database from "../Database";
import EnrollmentsDao from "../Enrollments/dao";
import CoursesDao from "./dao";

export default function CourseRoutes(app: Express, db: typeof Database) {
  const dao = CoursesDao(db);
  const enrollmentsDao = EnrollmentsDao(db);

  const findAllCourses = (_req: Request, res: Response) => {
    res.json(dao.findAllCourses());
  };

  const findCoursesForEnrolledUser = (req: Request<{ userId: string }>, res: Response) => {
    let { userId } = req.params;
    if (userId === "current") {
      const { currentUser } = req.session;
      if (!currentUser) {
        res.sendStatus(401);
        return;
      }
      userId = currentUser._id;
    }
    res.json(dao.findCoursesForEnrolledUser(userId));
  };

  const createCourse = (req: Request, res: Response) => {
    const { currentUser } = req.session;
    if (!currentUser) {
      res.sendStatus(401);
      return;
    }
    const newCourse = dao.createCourse(req.body);
    enrollmentsDao.enrollUserInCourse(currentUser._id, newCourse._id);
    res.json(newCourse);
  };

  const deleteCourse = (req: Request<{ courseId: string }>, res: Response) => {
    dao.deleteCourse(req.params.courseId);
    res.sendStatus(200);
  };

  const updateCourse = (req: Request<{ courseId: string }>, res: Response) => {
    const course = dao.updateCourse(req.params.courseId, req.body);
    if (!course) {
      res.sendStatus(404);
      return;
    }
    res.json(course);
  };

  type EnrollmentRequest = Request<{ uid: string; cid: string }>;

  function resolveEnrollmentUser(req: EnrollmentRequest) {
    const { uid } = req.params;
    return uid === "current" ? req.session.currentUser?._id : uid;
  }

  const enrollIntoCourse = (req: EnrollmentRequest, res: Response) => {
    const userId = resolveEnrollmentUser(req);
    if (!userId) {
      res.sendStatus(401);
      return;
    }
    res.json(enrollmentsDao.enrollUserInCourse(userId, req.params.cid));
  };

  const unenrollFromCourse = (req: EnrollmentRequest, res: Response) => {
    const userId = resolveEnrollmentUser(req);
    if (!userId) {
      res.sendStatus(401);
      return;
    }
    enrollmentsDao.unenrollUserFromCourse(userId, req.params.cid);
    res.sendStatus(200);
  };

  app.get("/api/courses", findAllCourses);
  app.get("/api/users/:userId/courses", findCoursesForEnrolledUser);
  app.post("/api/users/current/courses", createCourse);
  app.delete("/api/courses/:courseId", deleteCourse);
  app.put("/api/courses/:courseId", updateCourse);
  app.post("/api/users/:uid/courses/:cid", enrollIntoCourse);
  app.delete("/api/users/:uid/courses/:cid", unenrollFromCourse);
}
