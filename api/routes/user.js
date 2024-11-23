import express from 'express';
import { getSavedPosts, getMyUser, savePost, updateUser, getOtherUser } from '../controllers/user.js';
import { verifyToken } from '../middlewares/verifyToken.js';

const router = express.Router();

router.get('/:id', getMyUser);
router.get('/:id/saved', getSavedPosts);
router.get('/profiles/:id', getOtherUser);
router.post('/save/:id', savePost);
router.put('/:id',verifyToken, updateUser);

export default router;