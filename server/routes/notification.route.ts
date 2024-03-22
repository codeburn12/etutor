import express from 'express';
import { getNotifications , updateNotifications} from '../controllers/notification.controller';
import { authUser, authUserRoles } from '../middleware/auth';

const notificationsRouter = express.Router();

notificationsRouter.get('/get-all-notifications', authUser, authUserRoles("admin"), getNotifications);
notificationsRouter.put('/update-notifications/:id', authUser, authUserRoles("admin"), updateNotifications);

export default notificationsRouter;