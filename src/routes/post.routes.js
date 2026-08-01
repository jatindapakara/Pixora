const express = require('express');
const authMiddleware = require("../middleware/auth.middleware");
const uploadMiddleware = require("../middleware/upload.middleware");
const { createPost } = require("../controllers/post.controller");
const { createPost, likeUnlikePost } = require("../controllers/post.controller");
const router = express.Router();

router.post("/create",authMiddleware, uploadMiddleware.single("image"), createPost);
router.put("/like/:postId" , authMiddleware , likeUnlikePost);
module.exports = router;
