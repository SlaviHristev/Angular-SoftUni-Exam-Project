import express from 'express';
import { verifyToken } from '../middlewares/verifyToken.js';
import { createNotification, getNotifications, markAsRead } from '../controllers/notification.js';

const router = express.Router();

router.get('/:id',verifyToken, getNotifications );
router.post('/:id',verifyToken, createNotification );
router.patch('/:id', verifyToken, markAsRead);

export default router;