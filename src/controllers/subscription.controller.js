// import mongoose, {isValidObjectId} from "mongoose"
// import {User} from "../models/user.model.js"
// import { Subscription } from "../models/subscription.model.js"
// import {ApiError} from "../utils/ApiError.js"
// import {ApiResponse} from "../utils/ApiResponse.js"
// import {asyncHandler} from "../utils/asyncHandler.js"


// const toggleSubscription = asyncHandler(async (req, res) => {
//     const {channelId} = req.params
//     // TODO: toggle subscription
// })

// // controller to return subscriber list of a channel
// const getUserChannelSubscribers = asyncHandler(async (req, res) => {
//     const {channelId} = req.params
// })

// // controller to return channel list to which user has subscribed
// const getSubscribedChannels = asyncHandler(async (req, res) => {
//     const { subscriberId } = req.params
// })

// export {
//     toggleSubscription,
//     getUserChannelSubscribers,
//     getSubscribedChannels
// }


import mongoose from "mongoose"
import { User } from "../models/user.model.js"
import { Subscription } from "../models/subscription.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"

// Toggle subscription
const toggleSubscription = asyncHandler(async (req, res) => {
    const { channelId } = req.params;
    const { userId } = req.body;  // Assuming userId is passed in the request body

    // Check if user is already subscribed to the channel
    const existingSubscription = await Subscription.findOne({
        userId,
        channelId,
    });

    if (existingSubscription) {
        // User is already subscribed, so unsubscribe them
        await existingSubscription.remove();
        res.status(200).json(
            ApiResponse.success({
                message: "Unsubscribed successfully",
            })
        );
    } else {
        // User is not subscribed, so subscribe them
        const newSubscription = new Subscription({
            userId,
            channelId,
        });
        await newSubscription.save();

        res.status(200).json(
            ApiResponse.success({
                message: "Subscribed successfully",
            })
        );
    }
});

// Get list of subscribers for a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
    const { channelId } = req.params;

    const subscribers = await Subscription.find({ channelId }).populate('userId', 'username email');  // Populate with user details if needed

    if (subscribers.length === 0) {
        throw new ApiError(404, "No subscribers found for this channel");
    }

    res.status(200).json(
        ApiResponse.success({
            subscribers,
        })
    );
});

// Get list of channels the user has subscribed to
const getSubscribedChannels = asyncHandler(async (req, res) => {
    const { subscriberId } = req.params;

    const subscriptions = await Subscription.find({ userId: subscriberId }).populate('channelId', 'name description');  // Populate with channel details

    if (subscriptions.length === 0) {
        throw new ApiError(404, "No subscriptions found for this user");
    }

    res.status(200).json(
        ApiResponse.success({
            subscriptions,
        })
    );
});

export {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels,
};
