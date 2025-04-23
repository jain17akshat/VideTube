// import mongoose from "mongoose"
// import {Comment} from "../models/comment.model.js"
// import {ApiError} from "../utils/ApiError.js"
// import {ApiResponse} from "../utils/ApiResponse.js"
// import {asyncHandler} from "../utils/asyncHandler.js"

// const getVideoComments = asyncHandler(async (req, res) => {
//     //TODO: get all comments for a video
//     const {videoId} = req.params
//     const {page = 1, limit = 10} = req.query

//     const skip=[page-1]* limit;

//     const comments=await Comment.find({videoId})
//     .skip(skip)
//     .limit(limit)
//     res.status(200).json(
//         ApiResponse.success({
//             comments,   // The fetched comments
//             page,       // The current page number
//             limit       })

//         );
// })

// const addComment = asyncHandler(async (req, res) => {
//     // TODO: add a comment to a video

//     if(!content){
//         throw new ApiError(400,"Content is required for the comment")
//     }

// const newComment=new Comment({
//     videID,
//     content,
//     userId,
//     createdAt:new Date(),
// });
// await newComment.save();
// res.json({
//     success:true,
//     comment:newComment
// })

// })

// const updateComment = asyncHandler(async (req, res) => {
//     // TODO: update a comment

//     if(!content){
//         throw new ApiError(400,"Content is required to update the comment,");

//     }
//     const comment=await Comment.findById(commentId);
//     if(!comment){
//         throw new ApiError(404,"Comment not found");
//     }

//     comment.content=content;
//     await comment.save();
//     res.json({
//         success:true,
//         comment,
//     });
// });


// const deleteComment = asyncHandler(async (req, res) => {
//     // TODO: delete a comment
//     const { commentId } = req.params;  // Get the commentId from the URL

//     const comment = await Comment.findById(commentId);
//     if(!comment){
//         throw new ApiError(404,"Comment not found");
//     }
// await comment.remove();

// res.json({
//     success:true,
//     message:"Comment deleted Successfully"
// })


// })

// export {
//     getVideoComments, 
//     addComment, 
//     updateComment,
//      deleteComment
//     }
//complete
import mongoose from "mongoose"
import { Comment } from "../models/comment.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"

// Get all comments for a video
const getVideoComments = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    const { page = 1, limit = 10 } = req.query

    const skip = (page - 1) * limit

    const comments = await Comment.find({ videoId })
        .skip(skip)
        .limit(limit)
    
    res.status(200).json(
        ApiResponse.success({
            comments,   // The fetched comments
            page,       // The current page number
            limit       // The number of comments per page
        })
    );
});

// Add a comment to a video
const addComment = asyncHandler(async (req, res) => {
    const { content, videoId, userId } = req.body // Destructure request body
    
    if (!content) {
        throw new ApiError(400, "Content is required for the comment")
    }

    const newComment = new Comment({
        videoId,
        content,
        userId,
        createdAt: new Date(),
    })

    await newComment.save()

    res.json({
        success: true,
        comment: newComment
    })
});

// Update a comment
const updateComment = asyncHandler(async (req, res) => {
    const { content } = req.body // Destructure content from request body
    const { commentId } = req.params // Get commentId from URL params

    if (!content) {
        throw new ApiError(400, "Content is required to update the comment")
    }

    const comment = await Comment.findById(commentId)
    if (!comment) {
        throw new ApiError(404, "Comment not found")
    }

    comment.content = content
    await comment.save()

    res.json({
        success: true,
        comment,
    });
});

// Delete a comment
const deleteComment = asyncHandler(async (req, res) => {
    const { commentId } = req.params // Get the commentId from the URL

    const comment = await Comment.findById(commentId)
    if (!comment) {
        throw new ApiError(404, "Comment not found")
    }

    await comment.remove()

    res.json({
        success: true,
        message: "Comment deleted successfully"
    })
})

export {
    getVideoComments,
    addComment,
    updateComment,
    deleteComment
}
