// import { Router } from 'express';
// import {
//     getLikedVideos,
//     toggleCommentLike,
//     toggleVideoLike,
//     toggleTweetLike,
// } from "../controllers/like.controller.js"
// import {verifyJWT} from "../middlewares/auth.middleware.js"

// const router = Router();
// router.use(verifyJWT); // Apply verifyJWT middleware to all routes in this file

// router.route("/toggle/v/:videoId").post(toggleVideoLike);
// router.route("/toggle/c/:commentId").post(toggleCommentLike);
// router.route("/toggle/t/:tweetId").post(toggleTweetLike);
// router.route("/videos").get(getLikedVideos);

// export default router


//completed

import { Router } from 'express';
import {
    getLikedVideos,
    toggleCommentLike,
    toggleVideoLike,
    toggleTweetLike,
} from "../controllers/like.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();
router.use(verifyJWT); // Apply verifyJWT middleware to all routes in this file

// Routes to toggle likes for videos, comments, and tweets
router.route("/like/video/:videoId").post(toggleVideoLike);
router.route("/like/comment/:commentId").post(toggleCommentLike);
router.route("/like/tweet/:tweetId").post(toggleTweetLike);

// Route to get all liked videos
router.route("/liked-videos").get(getLikedVideos);

export default router;
