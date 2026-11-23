import { v4 as uuidv4 } from "uuid";
import type Database from "../Database";

export default function EnrollmentsDao(db: typeof Database) {
  function enrollUserInCourse(userId: string, courseId: string) {
    const existing = db.enrollments.find(
      (enrollment) => enrollment.user === userId && enrollment.course === courseId
    );
    if (existing) return existing;

    const enrollment = { _id: uuidv4(), user: userId, course: courseId };
    db.enrollments.push(enrollment);
    return enrollment;
  }

  function unenrollUserFromCourse(userId: string, courseId: string) {
    db.enrollments = db.enrollments.filter(
      (enrollment) => enrollment.user !== userId || enrollment.course !== courseId
    );
  }

  return { enrollUserInCourse, unenrollUserFromCourse };
}
