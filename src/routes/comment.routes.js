
// import { Router } from 'express';
// import {
//     addComment,
//     deleteComment,
//     getVideoComments,
//     updateComment,
// } from "../controllers/comment.controller.js"
// import {verifyJWT} from "../middlewares/auth.middleware.js"

// const router = Router();

// router.use(verifyJWT); // Apply verifyJWT middleware to all routes in this file

// router.route("/:videoId").get(getVideoComments).post(addComment);
// router.route("/c/:commentId").delete(deleteComment).patch(updateComment);

// export default router
import { Router } from 'express';
import {
    addComment,
    deleteComment,
    getVideoComments,
    updateComment,
} from "../controllers/comment.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

// Apply JWT verification middleware to all routes in this file
router.use(verifyJWT);

// Route to get and add comments to a video
router.route("/:videoId")
    .get(getVideoComments)   // Get comments for a video
    .post(addComment);       // Add a new comment to a video

// Route to delete and update a specific comment
router.route("/c/:commentId")
    .delete(deleteComment)   // Delete a comment by commentId
    .patch(updateComment);   // Update a comment by commentId

export default router;
