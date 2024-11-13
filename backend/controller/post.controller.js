import sharp from "sharp";
import cloudinary from "../utils/cloudinary.js";
import { Post } from "../model/post.model.js";
import { User } from "../model/user.model.js";
import { Comment } from "../model/comment.model.js";

export const addNewPost = async (req , res) => {
  try {
    const { caption } = req.body;
    const image = req.file;
    const authorId = req.id;

    if (!image) {
      return res.status(400).json({
        message: "Image required",
      });
    }

    const optimizedImageBuffer = await sharp(image.buffer)
      .resize({ width: 800, height: 800, fit: "inside" })
      .toFormat("jpeg", { quality: 80 })
      .toBuffer();

    //buffer to dataUri
    const fileUri = `data:image/jpeg;base64,${optimizedImageBuffer.toString(
      "base64"
    )}`;
    const cloudinaryResponse = await cloudinary.uploader.upload(fileUri);
    const post = await Post.create({
      caption,
      image: cloudinaryResponse.secure_url || cloudinaryResponse.url,
      author: authorId,
    });

    const user = await User.findById(authorId);
    if (user) {
      user.posts.push(post._id);
      await user.save();
    }
    await post.populate({ path: "author", select: "-password" });
    return res.status(200).json({
      message: "New post added",
      post,
      success: true,
    });
  } catch (error) {
    
    console.log( "error occured" , error);
  }
};

export const allPost = async (req , res) => {
  try {
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .populate({ path: "author", select: "username , profilePicture" })
      .populate({
        path: "comments",
        sort: { createdAt: -1 },
        populate: {
          path: "author",
          select: "username , profilePicture",
        },
      });

    return res.status(200).json({
      posts,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

export const getUserPost = async () => {
  const authorid = req.id;

  const posts = await Post.find({ id: authorid })
    .sort({ createdAt: -1 })
    .populate({ path: "author", select: "username profilePicture" })
    .populate({
      path: "comments",
      sort: { createdAt: -1 },
      populate: {
        path: "author",
        select: "username , profilePicture",
      },
    });

  return res.status(200).json({
    posts,
    success: true,
  });
};

export const likePost = async (req, res) => {
  try {
    const likeKarneWalaKiId = req.id;
    const postId = req.params.id;

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({
        message: "Post not found",
        success: false,
      });
    }
    // like logic started
    await post.updateOne({ $addToSet: { likes: likeKarneWalaKiId } });
    await post.save();

    // implement socket io for realtime notificaton

    return res.status(200).json({
      success: true,
      message: "Post liked",
    });
  } catch (error) {
    console.log(error);
  }
};

export const disLikePost = async (req, res) => {
  try {
    const disLikeKarneWaleUser = req.id;
    const postId = req.params.id;

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(400).json({
        success: false,
        message: "Post not found",
      });
    }

    // dislike logic start

    await post.updateOne({ $pull: { likes: disLikeKarneWaleUser } });
    await post.save();

    // implement socket.io for realtime notification

    return res.status(200).json({
      message: "Post disliked",
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

export const addComment = async (req, res) => {
  try {
    const postId = req.params.id;
    const commentKarneWaleUserKiId = req.id;
    const text = req.body;
    const post = await Post.findById(postId);
    if (!post)
      return res
        .status(400)
        .json({ message: "Post not found", success: false });

    const comment = await Comment.create({
      text,
      author: commentKarneWaleUserKiId,
      post: postId,
    }).populate({
      path: "author",
      select: "username , profilePicture",
    });

    post.comments.push(comment._id);
    await post.save();

    return res.status(200).json({
      message: "Commented Sucessfull",
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

export const getCommentsPost = async (req, res) => {
  try {
    const postId = req.params.id;

    const comments = await Comment.find({ post: postId }).populate(
      "author , username , profilePicture"
    );

    if (!comments)
      return res
        .status(400)
        .json({ message: "No comments found for this post", success: false });

    return res.status(200).json({
      comments,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

export const deletePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const authorId = req.id;

    const post = Post.findById(postId);
    if (!post)
      return res
        .status(400)
        .json({ message: "Post not found", success: false });

    // cheack if the logged in user does not belongs to the post
    if (post.author.toString() != authorId) {
      return res.status(400).json({
        message: "Unauthorized",
        success: false,
      });
    }

    // delete post
    await Post.findByIdAndDelete(postId);

    //remove the post id from user posts
    let user = await User.findById(authorid);
    user.posts = user.posts.filter((id) => id.toString() != postId);
    await user.save();

    // delete associated comment
    await Comment.deleteMany({ post: postId });

    return res.status(200).json({
      message: "post deleted",
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

export const bookmarkPost = async (req , res) => {
    try {
        const postId = req.params.id ;
        const userId = req.id ;

        const post = await Post.findById(postId)
        if(!post) return res.status(400).json({message : "post not found" , success : false})
        
        const user = await User.findById(userId)

        if (user.bookmarks.includes(post._id)) {
            // already bookmarked the post you unsvaed the post
            await user.updateOne( {$pull : {bookmarks : post._id}} )
            await user.save() 
            return res.status(200).json({type : saved , message:"post remove form bookmarked" , success : true})
        } else {
            await user.updateOne( {$addToSet : {bookmarks : post._id}} )
            await user.save()
            return res.status(200).json({ type : unsaved , message:"post bookmared" , success : true})
        }
    } catch (error) {
        console.log(error)
    }
};