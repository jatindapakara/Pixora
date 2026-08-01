const Post = require("../models/post.model");
const imagekit = require("../config/imagekit");


const createPost = async (req, res) => {
    try {
        const { caption } = req.body;
        if (!req.file) {
            return res.status(400).json({
                message: "Post image is required"
            });
        }
        const response = await imagekit.upload({
            file: req.file.buffer,
            fileName: req.file.originalname,
        })
        const post = await Post.create({
            user: req.user._id,
            image: response.url,
            caption,
        })
        return res.status(201).json({
            message: "Post created Successfully",
            post,
        })
    }
    catch (error) {
        return res.status(500).json({
            message: "Internal Server Error"
        });
    }
};


const likeUnlikePost = async (req, res) => {
    try {
        const { postId } = req.params;
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({
                message: "Post not found"
            });
        }
    }
    catch (error) {
        return res.status(500).json({
            message: "Internal Server Error"
        });
    }
};

module.exports = {
    createPost,
};