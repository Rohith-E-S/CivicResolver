import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res
        .status(404)
        .json({ success: false, message: "token not found" });
    }

    const decodedMessage = jwt.verify(token, process.env.JWT_SECRET_KEY);

    const user = await User.findById(decodedMessage._id);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    req.user = user;

    next();
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      success: false,
      message: `Error in protectRoute Middleware ${error.message}`,
    });
  }
};
