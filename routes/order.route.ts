import express from 'express';
import { createOrder } from '../controllers/order.controller';
import { authUser } from '../middleware/auth';

const orderRouter = express.Router();

orderRouter.post('/create-order', authUser, createOrder);

export default orderRouter;