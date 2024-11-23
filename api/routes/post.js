import express from 'express';
import { verifyToken } from '../middlewares/verifyToken.js';
import { addPost, deletePost, getPost, getPosts, updatePost,getRecent, getPostsByUser, searchPosts } from '../controllers/post.js';

const router = express.Router();

router.post('/',verifyToken, addPost);
router.get('/', getPosts);
router.get('/search',searchPosts);
router.get('/recent', getRecent)
router.get('/:id', getPost);
router.get('/user/:id', getPostsByUser);
router.delete('/:id', verifyToken, deletePost);
router.put('/edit/:id', verifyToken, updatePost);

export default router;