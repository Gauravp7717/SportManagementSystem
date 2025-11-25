import User from "../models/User.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import jwt from 'jsonwebtoken'

const generateAccessAndRefreshToken=async(userId)=>{
try{
    const user = await User.findById(userId)

    const accessToken=user.generateAccessToken();
    const refreshToken=user.generateRefreshToken();

    user.refreshToken=refreshToken;

    await user.save({ validateBeforeSave : false})

    return {accessToken, refreshToken}
}catch(error){
throw new apiError(
    500,
    "Error occured during the generation of the tokens",

)
}

}

const registerUser=asyncHandler(async(req,res)=>{
    const{username , password}=req.body

    if(!username || !password){
        throw new apiError(400,"Username and Password are required")
    }

    const existingUser=await User.findOne({username});
    if(existingUser){
        throw new apiError(409, "Username already exists")
    }

    const newUser=await User.create({
        username:username.toLowerCase(),
        password,
        role:"CLUB_ADMIN"
    })

    const{accessToken, refreshToken}=await generateAccessAndRefreshToken(newUser._id)

    const createdUser= await User.findById(newUser._id).select("-password -refreshToken")

    if(!createdUser){
        throw new apiError(500,"Something went wrong user not created")
    }
    const options={
        httpOnly:true,
        secure:true

    }

    return res
    .status(201)
    .cookie("accessToken",accessToken,options)
    .cookie("refreshToken",refreshToken,options)
    .json(new apiResponse(200,{createdUser,accessToken,refreshToken},"User registered successfully"))

})

const loginUser=asyncHandler(async(req,res)=>{
    const{username, password}=req.body

    if(!username || !password){
        throw new apiError(400,"Username and Password are required")
    }

    const user=await User.findOne({username})

    if(!user){
        throw new apiError(404,"User does not exist")
    }

    const checkPassword= await user.comparePassword(password)

    if(!checkPassword){
        throw new apiError(401,"Invalid Password")
    }

    const {accessToken, refreshToken}= await generateAccessAndRefreshToken(user._id)

    const loggedInUser= await User.findById(user._id).select("-password -refreshToken")

    const options={
        httpOnly:true,
        secure:true
    }

    return res
    .status(200)
    .cookie("accessToken",accessToken,options)
    .cookie("refreshToken",refreshToken,options)
    .json(new apiResponse(200,{loggedInUser,accessToken,refreshToken},"User logged in successfully"))



})

const logoutUser=asyncHandler(async(req,res)=>{
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset:{
                refreshToken:1
            },
        },
        {
            new:true,
        }
    )
    const options={
        httpOnly:true,
        secure:true
    }

    return res
    .status(200)
    .clearCookie("accessToken",options)
    .clearCookie("refreshToken",options)
    .json(new apiResponse(200,{},"User logged out successfully"))
})

const refreshAccessToken = asyncHandler(async (req, res) => {
  try {
    const incomingRefreshToken =
      req.cookies?.refreshToken || req.body.refreshToken

    if (!incomingRefreshToken) {
      throw new apiError(400, "invalid refresh token")
    }
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    )

    const user = await User.findById(decodedToken?._id)

    if (!user) {
      throw new apiError(400, "Invalid Refresh token user not found")
    }

    if (incomingRefreshToken !== user.refreshToken) {
      throw new apiError(400, "refresh Token expired or used")
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
      user._id
    )

    const options = {
      httpOnly: true,
      secure: true,
    }

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json(
        new apiResponse(
          200,
          { accessToken, refreshToken },
          "Access token refreshed"
        )
      )
  } catch (error) {
    throw new apiError(400, error?.message || "Invalid refresh token")
  }
})

const getCurrentUser=asyncHandler(async(req,res)=>{
    return res.status(200).json(new apiResponse(200,req.user,"User Fetched Successfully"))
})

const changeCurrentPassword=asyncHandler(async(req, res)=>{
    const {oldPassword,newPassword,confPassword}=req.body
    if(!oldPassword || !newPassword  || !confPassword){
        throw new apiError(400, "All fields are required")
    }
    if(newPassword!=confPassword){
        throw new apiError(400,"Password does not match")
    }

    const user= await User.findById(req.user?._id)

    const checkPassword=await user.comparePassword(oldPassword)
    if(!checkPassword){
        throw new apiError(400,"Please enter valid password")
    }
    user.password=newPassword
    await user.save({validateBeforeSave:false})

    return res
    .status(200)
    .json(new apiResponse(200,{},"Password changed successfully"))
})


export{
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    getCurrentUser,
    changeCurrentPassword
}

