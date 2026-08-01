const express = require('express');
const authMiddleware = require("../middleware/auth.middleware");
const uploadMiddleware = require("../middleware/upload.middleware");
const {
    registerUser,
    loginUser,
    getCurrentUser,
    updateProfile,
    changePassword,
    uploadProfilePicture,
} = require("../controllers/user.controller");

const router = express.Router();

router.post("/register" , registerUser);
router.post("/login"  , loginUser);
router.get("/me", authMiddleware, getCurrentUser);
router.put("/profile" , authMiddleware , updateProfile)
router.put("/change-password" , authMiddleware , changePassword)
router.put("/profile-picture", authMiddleware, uploadMiddleware.single("profilePicture") , uploadProfilePicture)
module.exports = router;

