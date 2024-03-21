import express from 'express';
import { authUser, authUserRoles } from '../middleware/auth';
import { getCourseAnalytics, getOrderAnalytics, getUserAnalytics } from '../controllers/analytics.controller';

const analyticsRouter = express.Router();

analyticsRouter.get("/get-users-analytics", authUser, authUserRoles("admin"), getUserAnalytics);
analyticsRouter.get("/get-courses-analytics", authUser, authUserRoles("admin"), getCourseAnalytics);
analyticsRouter.get("/get-orders-analytics", authUser, authUserRoles("admin"), getOrderAnalytics);

export default analyticsRouter;