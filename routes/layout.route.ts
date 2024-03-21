import express from 'express';
import { createLayout, editLayout, getLayoutByType } from '../controllers/layout.controller';
import { authUser, authUserRoles } from '../middleware/auth';

const layoutRouter = express.Router();

layoutRouter.post("/create-layout", authUser, authUserRoles("admin"), createLayout);
layoutRouter.put("/edit-layout", authUser, authUserRoles("admin"), editLayout);
layoutRouter.get("/get-layout", getLayoutByType);

export default layoutRouter;