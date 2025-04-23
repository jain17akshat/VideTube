
// import mongoose, { isValidObjectId } from "mongoose"
// import {Tweets} from "../models/tweets.model.js"
// import {User} from "../models/user.model.js"
// import {ApiError} from "../utils/ApiError.js"
// import {ApiResponse} from "../utils/ApiResponse.js"
// import {asyncHandler} from "../utils/asyncHandler.js"

// const createTweet = asyncHandler(async (req, res) => {
//     //TODO: create tweet
// })

// const getUserTweets = asyncHandler(async (req, res) => {
//     // TODO: get user tweets
// })

// const updateTweet = asyncHandler(async (req, res) => {
//     //TODO: update tweet
// })

// const deleteTweet = asyncHandler(async (req, res) => {
//     //TODO: delete tweet
// })

// export {
//     createTweet,
//     getUserTweets,
//     updateTweet,
//     deleteTweet
// }
import mongoose, { isValidObjectId } from "mongoose";
import { Tweets } from "../models/tweets.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// Create a new tweet
const createTweet = asyncHandler(async (req, res) => {
    const { content } = req.body;
    const userId = req.user._id;  // Assuming the user ID is added to the request by the `verifyJWT` middleware

    if (!content) {
        throw new ApiError(400, "Content is required for the tweet");
    }

    const newTweet = new Tweets({
        content,
        user: userId,
    });

    await newTweet.save();

    res.status(201).json(
        ApiResponse.success({
            tweet: newTweet,
        })
    );
});

// Get all tweets by a specific user
const getUserTweets = asyncHandler(async (req, res) => {
    const { userId } = req.params;

    // Check if the userId is valid
    if (!isValidObjectId(userId)) {
        throw new ApiError(400, "Invalid user ID");
    }

    const userTweets = await Tweets.find({ user: userId });

    if (!userTweets || userTweets.length === 0) {
        throw new ApiError(404, "No tweets found for this user");
    }

    res.status(200).json(
        ApiResponse.success({
            tweets: userTweets,
        })
    );
});

// Update a tweet
const updateTweet = asyncHandler(async (req, res) => {
    const { tweetId } = req.params;
    const { content } = req.body;

    // Check if tweetId is valid
    if (!isValidObjectId(tweetId)) {
        throw new ApiError(400, "Invalid tweet ID");
    }

    // Find the tweet to update
    const tweet = await Tweets.findById(tweetId);

    if (!tweet) {
        throw new ApiError(404, "Tweet not found");
    }

    // Check if the logged-in user is the owner of the tweet
    if (tweet.user.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You are not authorized to update this tweet");
    }

    // Update the tweet content
    tweet.content = content || tweet.content;
    await tweet.save();

    res.status(200).json(
        ApiResponse.success({
            tweet,
        })
    );
});

// Delete a tweet
const deleteTweet = asyncHandler(async (req, res) => {
    const { tweetId } = req.params;

    // Check if tweetId is valid
    if (!isValidObjectId(tweetId)) {
        throw new ApiError(400, "Invalid tweet ID");
    }

    // Find the tweet to delete
    const tweet = await Tweets.findById(tweetId);

    if (!tweet) {
        throw new ApiError(404, "Tweet not found");
    }

    // Check if the logged-in user is the owner of the tweet
    if (tweet.user.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You are not authorized to delete this tweet");
    }

    // Delete the tweet
    await tweet.remove();

    res.status(200).json(
        ApiResponse.success({
            message: "Tweet deleted successfully",
        })
    );
});

export { createTweet, getUserTweets, updateTweet, deleteTweet };
