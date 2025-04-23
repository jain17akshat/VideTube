// import { Router } from 'express';
// import {
//     addVideoToPlaylist,
//     createPlaylist,
//     deletePlaylist,
//     getPlaylistById,
//     getUserPlaylists,
//     removeVideoFromPlaylist,
//     updatePlaylist,
// } from "../controllers/playlist.controller.js"
// import {verifyJWT} from "../middlewares/auth.middleware.js"

// const router = Router();

// router.use(verifyJWT); // Apply verifyJWT middleware to all routes in this file

// router.route("/").post(createPlaylist)

// router
//     .route("/:playlistId")
//     .get(getPlaylistById)
//     .patch(updatePlaylist)
//     .delete(deletePlaylist);

// router.route("/add/:videoId/:playlistId").patch(addVideoToPlaylist);
// router.route("/remove/:videoId/:playlistId").patch(removeVideoFromPlaylist);

// router.route("/user/:userId").get(getUserPlaylists);

// export default router
import { Router } from 'express';
import {
    addVideoToPlaylist,
    createPlaylist,
    deletePlaylist,
    getPlaylistById,
    getUserPlaylists,
    removeVideoFromPlaylist,
    updatePlaylist,
} from "../controllers/playlist.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

// Apply verifyJWT middleware to all routes in this file
router.use(verifyJWT);

// Route to create a playlist
router.route("/").post(createPlaylist);

// Routes for specific playlist by ID
router
    .route("/:playlistId")
    .get(getPlaylistById)
    .patch(updatePlaylist)
    .delete(deletePlaylist);

// Routes to add and remove videos from playlist (consider using POST and DELETE for semantical accuracy)
router.route("/add/:videoId/:playlistId").post(addVideoToPlaylist);  // POST to add video
router.route("/remove/:videoId/:playlistId").delete(removeVideoFromPlaylist);  // DELETE to remove video

// Route to get user playlists (fetch playlists for the logged-in user)
router.route("/user").get(getUserPlaylists);  // Assuming the controller handles getting playlists for the authenticated user

export default router;
