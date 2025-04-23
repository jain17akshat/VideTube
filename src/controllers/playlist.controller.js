import mongoose, {isValidObjectId} from "mongoose"
import {Playlist} from "../models/playlist.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"


const createPlaylist = asyncHandler(async (req, res) => {
    const {name, description} = req.body

    //TODO: create playlist

if(!name){
    throw new ApiError(400,"Playlist name is required")
}
const newPlaylist=await Playlist.create({
    name,
    description,
    owner:req.user._id,
    videos:[]
});


res.status(201).json(
    new ApiResponse(201,newPlaylist,"Playlist created successfully")
);

})

const getUserPlaylists = asyncHandler(async (req, res) => {
    const {userId} = req.params
    //TODO: get user playlists
    if(!isValidObjectId(userId)){
        throw new ApiError(400,"Invalid user Id")
    }
    const playlist=await Playlist.find({owner:userId}).sort({createdAt:-1});
    res.status(200).json(
        new ApiResponse(200,playlists,"User playlists fetched Successfully")
    )
})

const getPlaylistById = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    //TODO: get playlist by id
if(!isValidObjectId(playlistId)){
    throw new ApiError(400,"Invalid Playlist ID");
}

const playlist=await Playlist.findById(playlistId);

if(!playlist){
    throw new ApiError(404,"Playlist not found");

}


res.status(200).json(
    new ApiResponse(200,playlist,"Playlist fetched successfully")
)
})

const addVideoToPlaylist = asyncHandler(async (req, res) => {
    const {playlistId, videoId} = req.params

    if (!isValidObjectId(playlistId) || !isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid playlist or video ID");
    }

    const playlist = await Playlist.findById(playlistId);

    if (!playlist) {
        throw new ApiError(404, "Playlist not found");
    }

    // Avoid duplicate video entries
    if (playlist.videos.includes(videoId)) {
        throw new ApiError(400, "Video already in playlist");
    }

    playlist.videos.push(videoId);
    await playlist.save();

    res.status(200).json(
        new ApiResponse(200, playlist, "Video added to playlist")
    );

})

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
    const {playlistId, videoId} = req.params
    // TODO: remove video from playlist

    if(!isValidObjectId(playlistId)|| !isValidObjectId(videoId)){
        throw new ApiError(400,"Invalid playlist or video ID")
    }
    const playlist=await Playlist.findById(playlistId);
    if(!playlist){
        throw new ApiError(404,"Playlist not found");

    }


    if(!playlist.videos.includes(videoId))
    {
throw new ApiError(404,"Video not found in Playlist")
    }

    playlist.videos=playlist.videos.filter(
        (id)=>id.toString() !==videoId
    )
await playlist.save();

res.status(200).json(
    new ApiResponse(200,playlist,"Video removed from playlist")
);
})

const deletePlaylist = asyncHandler(async (req, res) => {
    const { playlistId } = req.params;

    // Validate playlistId
    if (!isValidObjectId(playlistId)) {
        throw new ApiError(400, "Invalid playlist ID");
    }

    const playlist = await Playlist.findById(playlistId);

    if (!playlist) {
        throw new ApiError(404, "Playlist not found");
    }

    // (Optional) Check if the current user is the owner
    if (playlist.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You are not authorized to delete this playlist");
    }

    await Playlist.findByIdAndDelete(playlistId);

    res.status(200).json(
        new ApiResponse(200, null, "Playlist deleted successfully")
    );
});


const updatePlaylist = asyncHandler(async (req, res) => {
    const { playlistId } = req.params;
    const { name, description } = req.body;

    // Validate playlistId
    if (!isValidObjectId(playlistId)) {
        throw new ApiError(400, "Invalid playlist ID");
    }

    const playlist = await Playlist.findById(playlistId);

    if (!playlist) {
        throw new ApiError(404, "Playlist not found");
    }

    // Check ownership
    if (playlist.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You are not authorized to update this playlist");
    }

    // Update fields if provided
    if (name) playlist.name = name;
    if (description) playlist.description = description;

    await playlist.save();

    res.status(200).json(
        new ApiResponse(200, playlist, "Playlist updated successfully")
    );
});


export {
    createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist
}
//completed