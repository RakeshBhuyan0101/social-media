import { User } from "../model/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";
import { Post } from "../model/post.model.js";

export const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
        return res.status(401).json({
            message: "Something is missing, please check!",
            success: false,
        });
    }
    const user = await User.findOne({ email });
    if (user) {
        return res.status(401).json({
            message: "Try different email",
            success: false,
        });
    };
    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({
        username,
        email,
        password: hashedPassword
    });
    return res.status(201).json({
        message: "Account created successfully.",
        success: true,
    });
} catch (error) {
    console.log(error);
}
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!password || !email) {
      return res.status(401).json({
        message: "Something is missing Please cheack !",
        success: false,
      });
    }
    let user = await User.findOne({ email });

    // If user not exist
    if (!user) {
      return res.status(401).json({
        message: "Incorrect email or password",
        success: false,
      });
    }

    // If password is incorrect
    const isPassword = await bcrypt.compare(password, user.password);
    if (!isPassword) {
      return res.status(401).json({
        message: "Incorrect email or password",
        success: false,
      });
    }

     const populatedPosts = await Promise.all(
        user.posts.map(async(postId) => {
          const post = await Post.findById(postId);
          if (post.author.equals(user._id)) {
            return post ;
          }
          return null ;
        })
     )

    user = {
      _id : user._id,
      username: user.username,
      email: user.email,
      profilePicture: user.profilePicture,
      bio: user.bio,
      followers: user.followers,
      following: user.following,
      post: populatedPosts,
    };
    const token = jwt.sign(
      {
        userId: user._id,
      },
      process.env.JWt_SECRETE_KEY,
      { expiresIn: "1d" }
    );


    return res
      .cookie("token", token, {
        httpOnly: true,
        sameSite: "strict",
        maxAge: 1 * 24 * 60 * 60 * 1000,
      })
      .json({
        message: `Welcome back ${user.username}`,
        success: true,
        user,
      });
  } catch (error) {
    console.log(error);
  }
};

export const logout = async (req, res) => {
  try {
    return res.cookie("token", { maxAge: 0 }).json({
      message: "Logged out Sucessfully",
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

export const getProfile = async (req, res) => {
  try {
    const userId = req.params.id;
    let user = await User.findById(userId).select("-password");
    return res.status(200).json({
      user,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

export const editProfile = async (req, res) => {
  try {
    const userId = req.id;
    const { bio, gender } = req.body;
    const profilePicture = req.file;
    let cloudResponse;

    // Check if user exists
    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }

    // Upload profile picture if provided
    if (profilePicture) {
      const fileUri = getDataUri(profilePicture);
      try {
        cloudResponse = await cloudinary.uploader.upload(fileUri);
      } catch (uploadError) {
        return res.status(500).json({
          message: "Error uploading profile picture",
          success: false,
          error: uploadError.message,
        });
      }
      user.profilePicture = cloudResponse.secure_url;
    }

    // Update user fields if provided
    if (bio) user.bio = bio;
    if (gender) user.gender = gender;

    await user.save(); // save changes in database

    return res.status(200).json({
      message: "Profile updated",
      success: true,
      user,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Server error",
      success: false,
      error: error.message,
    });
  }
};

export const getSuggestedUsers = async (req, res) => {
  try {
    const suggestedUsers = await User.find({ _id: { $ne: req.id } }).select("-password");

    if (!suggestedUsers) {
      return res.status(400).json({
        message: "Currently do not have any users",
        success: false,
      })
    };

    return res.status(200).json({
      success: true,
      users: getSuggestedUsers,
    });
  } catch (error) {
    console.log(error);
  }
};

export const followOrUnfollow = async (req, res) => {
  try {
    const followKarneWala = req.id;
    const jiskoFollowKaroge = req.param.id;

    if (followKarneWala === jiskoFollowKaroge) {
      return res.status(400).json({
        message: "You can't follow yourself",
        success: false,
      });
    }

    const user = await User.findById(followKarneWala);
    const targetUser = await User.findById(jiskoFollowKaroge);

    if (!user || !targetUser) {
      return res.status(400).json({
        message: "User not found",
        success: false,
      });
    }

    // main cheack karung ki follow karna ha ki unFollow karunga
    const isFollowing = user.following.includes(jiskoFollowKaroge);
    if (isFollowing) {
      // unfollow logic
      await Promise.all([
        User.updateOne(
          { _id: followKarneWala },
          { $pull: { following: jiskoFollowKaroge } }
        ),
        User.updateOne(
          { _id: jiskoFollowKaroge },
          { $pull: { followers: followKarneWala } }
        ),
      ]);

      return res.status(200).json({
        message: "unfollowed succesfully",
        success: true,
      });
    } else {
      // follow logic
      await Promise.all([
        User.updateOne(
          { _id: followKarneWala },
          { $push: { following: jiskoFollowKaroge } }
        ),
        User.updateOne(
          { _id: jiskoFollowKaroge },
          { $push: { followers: followKarneWala } }
        ),
      ]);
      return res.status(200).json({
        message: "followed succesfully",
        success: true,
      });
    }
  } catch (error) {
    console.log(error);
  }
};
