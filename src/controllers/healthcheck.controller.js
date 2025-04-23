// import {ApiError} from "../utils/ApiError.js"
// import {ApiResponse} from "../utils/ApiResponse.js"
// import {asyncHandler} from "../utils/asyncHandler.js"


// const healthcheck = asyncHandler(async (req, res) => {
//     //TODO: build a healthcheck response that simply returns the OK status as json with a message
// })

// export {
//     healthcheck
//     }



//completed
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"

// Healthcheck endpoint to verify the server is up and running
const healthcheck = asyncHandler(async (req, res) => {
    res.status(200).json(
        ApiResponse.success({
            message: "Server is running successfully",
            status: "OK"
        })
    );
})

export {
    healthcheck
}
