import mongoose, {isValidObjectId} from "mongoose"
import {Video} from "../models/video.model.js"
import {User} from "../models/user.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"


const getAllVideos = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, query, sortBy = 'createdAt', sortType = 'desc', userId } = req.query;

    // Convert page and limit to numbers
    const pageNum = parseInt(page, 10);
    const pageSize = parseInt(limit, 10);

    // Build query object
    const searchQuery = query ? {
        $or: [
            { title: { $regex: query, $options: 'i' } },
            { description: { $regex: query, $options: 'i' } }
        ]
    } : {};

    // Build sort object
    const sortObject = {
        [sortBy]: sortType === 'asc' ? 1 : -1
    };

    const videos = await Video.find(searchQuery)
        .sort(sortObject)
        .skip((pageNum - 1) * pageSize)
        .limit(pageSize);

    // Get total video count for pagination
    const totalVideos = await Video.countDocuments(searchQuery);

    res.status(200).json(ApiResponse.success({
        videos,
        pagination: {
            page: pageNum,
            limit: pageSize,
            totalPages: Math.ceil(totalVideos / pageSize),
            totalVideos
        }
    }));
});


const publishAVideo = asyncHandler(async (req, res) => {
    const { title, description } = req.body;
    const videoFile = req.files?.video; // Assuming video is sent as a file via multipart form-data

    if (!videoFile) {
        throw new ApiError(400, "Video file is required");
    }

    // Upload video to Cloudinary
    const cloudinaryResult = await uploadOnCloudinary(videoFile.path);

    // Save video to database
    const newVideo = new Video({
        title,
        description,
        videoUrl: cloudinaryResult.secure_url,
        videoPublicId: cloudinaryResult.public_id,
        owner: req.user._id, // Assuming JWT middleware adds the user to request
        createdAt: Date.now()
    });

    await newVideo.save();

    res.status(201).json(ApiResponse.success({ video: newVideo }));
});

const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params;

    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video ID");
    }

    const video = await Video.findById(videoId);

    if (!video) {
        throw new ApiError(404, "Video not found");
    }

    res.status(200).json(ApiResponse.success({ video }));
});


const updateVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    const { title, description } = req.body;

    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video ID");
    }

    const video = await Video.findById(videoId);

    if (!video) {
        throw new ApiError(404, "Video not found");
    }

    video.title = title || video.title;
    video.description = description || video.description;

    // If a new thumbnail is uploaded, handle it (assumes req.files contains the thumbnail)
    if (req.files?.thumbnail) {
        const cloudinaryResult = await uploadOnCloudinary(req.files.thumbnail.path);
        video.thumbnailUrl = cloudinaryResult.secure_url;
        video.thumbnailPublicId = cloudinaryResult.public_id;
    }

    await video.save();

    res.status(200).json(ApiResponse.success({ video }));
});

const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params;

    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video ID");
    }

    const video = await Video.findById(videoId);

    if (!video) {
        throw new ApiError(404, "Video not found");
    }

    // Delete video from Cloudinary
    await cloudinary.v2.uploader.destroy(video.videoPublicId);

    // Delete video from database
    await video.remove();

    res.status(200).json(ApiResponse.success({ message: "Video deleted successfully" }));
});


const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params;

    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video ID");
    }

    const video = await Video.findById(videoId);

    if (!video) {
        throw new ApiError(404, "Video not found");
    }

    // Toggle publish status
    video.isPublished = !video.isPublished;
    await video.save();

    res.status(200).json(ApiResponse.success({ video }));
});

export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus
}