import express from 'express';
import { createOrder, getAllOrders } from '../controllers/order.controller';
import { authUser, authUserRoles } from '../middleware/auth';

const orderRouter = express.Router();

orderRouter.post('/create-order', authUser, createOrder);
orderRouter.get('/get-orders', authUser, authUserRoles("admin"), getAllOrders);

export default orderRouter;