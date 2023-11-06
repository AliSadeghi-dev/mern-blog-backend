const {Router} = require('express');
const { createPostCtrl } = require('../../controllers/posts/postCtrl');
const authMiddleware = require('../../middlewares/auth/authMiddleware');

const postRoutes = Router();

postRoutes.post("/", authMiddleware,createPostCtrl);


module.exports = postRoutes;


