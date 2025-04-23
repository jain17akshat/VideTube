// import mongoose from "mongoose"
// import {Video} from "../models/video.model.js"
// import {Subscription} from "../models/subscription.model.js"
// import {Like} from "../models/like.model.js"
// import {ApiError} from "../utils/ApiError.js"
// import {ApiResponse} from "../utils/ApiResponse.js"
// import {asyncHandler} from "../utils/asyncHandler.js"

// const getChannelStats = asyncHandler(async (req, res) => {
//     // TODO: Get the channel stats like total video views, total subscribers, total videos, total likes etc.
// const {channelId}=req.params;
// const totalSubscribers=await Subscription.countDocuments({channelId});

// const totalVideos=await Video.countDocuments({channelId});

// const totalVideoViews=await Video.aggregate([
//     {
//         $match:{channelId},
//     },

//     { $group: { _id: null, totalLikes: { $sum: 1 } } }

// ]);
// const totalLikeCount=totalLikes.length>0 ? totalLikes[0].totalLikes:0;
// res.stauts(200).json(
//     ApiResponse.success({
//         totalSubscribers,
//         totalVideos,
//         totalVideoViews,
//         totalViews,
//         totalLikeCount,
//     })
// )

// })

// const getChannelVideos = asyncHandler(async (req, res) => {
//     // TODO: Get all the videos uploaded by the channel

//     const {channelId}=req.params;
//     const videos =await Video.find({channelId}).sort({createdAt:-1});
//     res.status(200).json(
//         ApiResponse.success({
//             videos
//         })
//     )
// })

// export {
//     getChannelStats, 
//     getChannelVideos
//     }



//completed
import mongoose from "mongoose";
import { Video } from "../models/video.model.js";
import { Subscription } from "../models/subscription.model.js";
import { Like } from "../models/like.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// Get channel stats like total video views, total subscribers, total videos, total likes, etc.
const getChannelStats = asyncHandler(async (req, res) => {
    const { channelId } = req.params;

    // Get total subscribers for the channel
    const totalSubscribers = await Subscription.countDocuments({ channelId });

    // Get total videos for the channel
    const totalVideos = await Video.countDocuments({ channelId });

    // Get total video views for the channel by summing up views from all videos
    const totalVideoViews = await Video.aggregate([
        { $match: { channelId } },  // Filter by channelId
        { $group: { _id: null, totalViews: { $sum: "$views" } } } // Sum the views field
    ]);

    // If no video views are found, set totalViews to 0
    const totalViews = totalVideoViews.length > 0 ? totalVideoViews[0].totalViews : 0;

    // Get total likes for the channel
    const totalLikes = await Like.aggregate([
        { $match: { channelId } },  // Filter likes by channelId
        { $group: { _id: null, totalLikes: { $sum: 1 } } } // Count all likes for the channel
    ]);

    // If no likes are found, set totalLikeCount to 0
    const totalLikeCount = totalLikes.length > 0 ? totalLikes[0].totalLikes : 0;

    // Send the response with the channel stats
    res.status(200).json(
        ApiResponse.success({
            totalSubscribers,
            totalVideos,
            totalViews,  // Correctly passing totalViews
            totalLikeCount,
        })
    );
});

// Get all videos uploaded by the channel
const getChannelVideos = asyncHandler(async (req, res) => {
    const { channelId } = req.params;

    // Fetch all videos for the channel, sorted by creation date
    const videos = await Video.find({ channelId }).sort({ createdAt: -1 });

    // Return the list of videos in the API response
    res.status(200).json(
        ApiResponse.success({
            videos
        })
    );
});

export { getChannelStats, getChannelVideos };
