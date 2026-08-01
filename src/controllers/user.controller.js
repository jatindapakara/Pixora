const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const imagekit = require("../config/imagekit");


const registerUser = async (req, res) => {
    try {
        const { name, username, email, password } = req.body;
        const existingEmail = await User.findOne({ email })
        if (existingEmail) {
            return res.status(409).json({
                message: "Email already exists"
            });
        }
        const existingUsername = await User.findOne({ username })
        if (existingUsername) {
            return res.status(409).json({
                message: "Username already exists"
            });
        }
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            username,
            email,
            password: hashedPassword,
        })
        user.password = undefined;
        return res.status(201).json({
            message: "User registeered succeessfully",
            user,
        });
    }
    catch (error) {
        return res.status(500).json({
            message: "Internal Server Error"
        })
    };
};


const loginUser = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email })
    if (!user) {
        return res.status(401).json({
            message: "Invalid email or password"
        })
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.status(401).json({
            message: "Invalid email or password"
        });
    }
    const token = jwt.sign(
        {
            id: user._id,
        },
        process.env.JWT_SECRET,
        {

            expiresIn: "7d"

        }
    )
    user.password = undefined;
    return res.status(200).json({
        message: "Login successful",
        token,
        user,
    })
}

const getCurrentUser = async (req, res) => {

    return res.status(200).json({
        user: req.user,
    })
}


const updateProfile = async (req, res) => {
    try {
        const { name, username } = req.body;
        const existingUsername = await User.findOne({ username });
        if (existingUsername && existingUsername._id.toString() !== req.user._id.toString()) {
            return res.status(409).json({
                message: "Username already used"
            })
        }

        const user = await User.findByIdAndUpdate(

            req.user._id,
            {
                name,
                username,
            },
            {
                new: true,
                runValidators: true
            }
        ).select("-password");
        if (!user) {
            return res.status(404).json({
                message: "User not found"
            })
        }
        return res.status(200).json({
            message: "Profile updated successfully",
            user,
        });
    }
    catch (error) {
        return res.status(500).json({
            message: "Internal Server Error"
        });
    }

}


const changePassword = async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;
        if (!oldPassword || !newPassword) {
            return res.status(400).json({
                message: "Old password and new password are required"
            });
        }

        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }
        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) {
            return res.status(401).json({
                message: "Old password is incorrect"
            });
        }
        if (oldPassword === newPassword) {
            return res.status(400).json({
                message: "New password must be different from the old password"
            });
        }
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        await user.save();
        return res.status(200).json({
            message: "Password changed successfully"
        });
    }
    catch (error) {
        return res.status(500).json({
            message: "Internal Server Error"
        });
    }
};


const uploadProfilePicture = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                message: "Profile picture is required"
            })
        }
        const response = await imagekit.upload({
            file: req.file.buffer,
            fileName: req.file.originalname,
        })
        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }
        user.profilePicture = response.url;
        await user.save();
        user.password = undefined;
        return res.status(200).json({
            message: "Profile picture updated successfully",
            user,
        });
    }
    catch (error) {
        return res.status(500).json({
            message: "Internal Server Error"
        });
 
    }
}

module.exports = {
    registerUser,
    loginUser,
    getCurrentUser,
    updateProfile,
    changePassword,
    uploadProfilePicture
};