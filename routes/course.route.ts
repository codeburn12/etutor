import express from 'express';
import { addAnswer, addQuestions, addReview, addReviewReplies, editCourse, getAllCourse, getCourseByUser, getSingleCourse, uploadCourse } from '../controllers/course.controller';
import { authUser, authUserRoles } from '../middleware/auth';

const courseRouter = express.Router();

courseRouter.post("/create-course", authUser, authUserRoles("admin"), uploadCourse);
courseRouter.put('/edit-course/:id', authUser, authUserRoles("admin"), editCourse);
courseRouter.get('/get-course/:id', getSingleCourse);
courseRouter.get('/get-all-course', getAllCourse);
courseRouter.get('/get-course-content/:id', authUser,getCourseByUser);
courseRouter.put('/add-question', authUser,addQuestions);
courseRouter.put('/add-answer', authUser,addAnswer);
courseRouter.put('/add-review/:id', authUser,addReview);
courseRouter.put('/add-review-reply', authUser,authUserRoles("admin"),addReviewReplies);

export default courseRouter;