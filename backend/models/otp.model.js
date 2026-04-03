import mongoose from "mongoose";

const otpSchema = new mongoose.Schema({
  email: { type: String, required: true },
  otp: { type: String, required: true },
  expiresAt: {
    type: Date,
    required: true,
    default: () => new Date(Date.now() + 2 * 60 * 1000),
  },
  isForgotPassword: { type: Boolean, default: false },
});

export default mongoose.model("OTP", otpSchema);
