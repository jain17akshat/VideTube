
import { Router } from 'express';
import {
    addComment,
    deleteComment,
    getVideoComments,
    updateComment,
} from "../controllers/comment.controller.js"
import {verifyJWT} from "../middlewares/auth.middleware.js"
import { checkUser } from '../middlewares/openRouteAuth.middleware.js';

const router = Router();

// http://localhost:8000/api/v1/comment/...

router.route("/get/:videoId").get(checkUser, getVideoComments);
router.route("/add/:videoId").post(verifyJWT, addComment);
router
  .route("/:commentId")
  .patch(verifyJWT, updateComment)
  .delete(verifyJWT, deleteComment);

export default router
