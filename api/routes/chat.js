import express from 'express';
import { verifyToken } from '../middlewares/verifyToken.js';
import { getChatHistory, getChats, startChat } from '../controllers/chat.js';

const router = express.Router();

router.get('/:chatId', verifyToken, getChatHistory);
router.get('/user/:userId', verifyToken, getChats);
router.post('/startChat', verifyToken, startChat);

export default router;