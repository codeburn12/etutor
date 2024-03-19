import express from 'express';
import { editCourse, getAllCourse, getCourseByUser, getSingleCourse, uploadCourse } from '../controllers/course.controller';
import { authUser, authUserRoles } from '../middleware/auth';

const courseRouter = express.Router();

courseRouter.post("/create-course", authUser, authUserRoles("admin"), uploadCourse);
courseRouter.put('/edit-course/:id', authUser, authUserRoles("admin"), editCourse);
courseRouter.get('/get-course/:id', getSingleCourse);
courseRouter.get('/get-all-course', getAllCourse);
courseRouter.get('/get-course-content/:id', authUser,getCourseByUser);

export default courseRouter;