// import mongoose, {isValidObjectId} from "mongoose"
// import {Like} from "../models/like.model.js"
// import {ApiError} from "../utils/ApiError.js"
// import {ApiResponse} from "../utils/ApiResponse.js"
// import {asyncHandler} from "../utils/asyncHandler.js"

// const toggleVideoLike = asyncHandler(async (req, res) => {
//     const {videoId} = req.params
//     //TODO: toggle like on video
// })

// const toggleCommentLike = asyncHandler(async (req, res) => {
//     const {commentId} = req.params
//     //TODO: toggle like on comment

// })

// const toggleTweetLike = asyncHandler(async (req, res) => {
//     const {tweetId} = req.params
//     //TODO: toggle like on tweet
// }
// )

// const getLikedVideos = asyncHandler(async (req, res) => {
//     //TODO: get all liked videos
// })

// export {
//     toggleCommentLike,
//     toggleTweetLike,
//     toggleVideoLike,
//     getLikedVideos
// }

//completed


import mongoose from "mongoose";
import { Like } from "../models/like.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// Toggle Like for a Video
const toggleVideoLike = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    const userId = req.user.id; // Assuming user ID is stored in req.user after JWT authentication

    if (!mongoose.isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video ID.");
    }

    const existingLike = await Like.findOne({ userId, videoId });
    
    if (existingLike) {
        // If the user has already liked this video, remove the like
        await existingLike.remove();
        return res.status(200).json(ApiResponse.success({ message: "Like removed from video." }));
    } else {
        // Otherwise, add a like to the video
        const newLike = new Like({ userId, videoId });
        await newLike.save();
        return res.status(200).json(ApiResponse.success({ message: "Video liked." }));
    }
});

// Toggle Like for a Comment
const toggleCommentLike = asyncHandler(async (req, res) => {
    const { commentId } = req.params;
    const userId = req.user.id;

    if (!mongoose.isValidObjectId(commentId)) {
        throw new ApiError(400, "Invalid comment ID.");
    }

    const existingLike = await Like.findOne({ userId, commentId });
    
    if (existingLike) {
        await existingLike.remove();
        return res.status(200).json(ApiResponse.success({ message: "Like removed from comment." }));
    } else {
        const newLike = new Like({ userId, commentId });
        await newLike.save();
        return res.status(200).json(ApiResponse.success({ message: "Comment liked." }));
    }
});

// Toggle Like for a Tweet
const toggleTweetLike = asyncHandler(async (req, res) => {
    const { tweetId } = req.params;
    const userId = req.user.id;

    if (!mongoose.isValidObjectId(tweetId)) {
        throw new ApiError(400, "Invalid tweet ID.");
    }

    const existingLike = await Like.findOne({ userId, tweetId });
    
    if (existingLike) {
        await existingLike.remove();
        return res.status(200).json(ApiResponse.success({ message: "Like removed from tweet." }));
    } else {
        const newLike = new Like({ userId, tweetId });
        await newLike.save();
        return res.status(200).json(ApiResponse.success({ message: "Tweet liked." }));
    }
});

// Get all liked videos by the user
const getLikedVideos = asyncHandler(async (req, res) => {
    const userId = req.user.id;

    const likedVideos = await Like.find({ userId }).populate('videoId');  // Assuming the Like model has a videoId field

    res.status(200).json(ApiResponse.success({ likedVideos }));
});

export {
    toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike,
    getLikedVideos
};
