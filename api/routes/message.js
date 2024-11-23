import express from 'express';
import { verifyToken } from '../middlewares/verifyToken.js';
import { sendMessage } from '../controllers/message.js';


const router = express.Router();

router.post('/send', verifyToken, sendMessage);


export default router;

