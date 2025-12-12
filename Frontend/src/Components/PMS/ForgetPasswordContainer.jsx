import Backdrop from "@mui/material/Backdrop";
import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import PuffLoader from "react-spinners/ClipLoader";
import apiService from "../services/apiServices";
import {
  Email,
  ArrowBack,
  ErrorOutline,
  CheckCircle,
} from "@mui/icons-material";

const ForgetPasswordContainer = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    if (!e.target.value.trim()) {
      setError("");
    }
  };

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();
    if (!email.trim()) {
      setError("Email is required");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const response = await apiService.forgotpassword(email);
      console.log("Password reset email sent successfully:", response);
      setSuccessMessage(
        "Your one-time login code has been sent to your email. Click the link in the email to reset your password."
      );
      setError("");
    } catch (error) {
      console.error("Error sending email:", error);
      console.log("Error", error);
      if (
        error.message === "Account with this email address is not available"
      ) {
        setError(error.message);
        setSuccessMessage("");
      } else {
        setError("An unexpected error occurred. Please try again later.");
        setSuccessMessage("");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-8 bg-white rounded-2xl border border-gray-100">
      <Helmet>
        <title>PMS - Forget Password</title>
      </Helmet>

      {/* Loading Backdrop */}
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
      >
        <PuffLoader color="#fff" />
      </Backdrop>

      {/* Header */}
      <div className="text-center mb-8">
        <div className="mb-2">
          <div className="w-16 h-16 bg-gradient-to-r from-sky-900 via-sky-800 to-sky-900 rounded-full flex items-center justify-center mx-auto mb-4">
            <Email style={{ fontSize: 32, color: "white" }} />
          </div>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Reset Your Password</h1>
        <p className="text-gray-600">
          Enter your email for verification. We'll send a password reset link to your email.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Email Field */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
            Email Address
          </label>
          <div className="relative">
            <input
              id="email"
              type="email"
              className="w-full px-4 py-3 pl-11 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              value={email}
              onChange={handleEmailChange}
              placeholder="example@gmail.com"
              required
            />
            <div className="absolute inset-y-0 left-0 flex items-center pl-3">
              <Email style={{ fontSize: 20, color: "#9CA3AF" }} />
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <div className="flex items-center">
              <ErrorOutline style={{ fontSize: 20, color: "#F87171", marginRight: 8 }} />
              <span className="text-red-700 text-sm">{error}</span>
            </div>
          </div>
        )}

        {/* Success Message */}
        {successMessage && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
            <div className="flex items-center">
              <CheckCircle style={{ fontSize: 20, color: "#10B981", marginRight: 8 }} />
              <span className="text-green-700 text-sm">{successMessage}</span>
            </div>
          </div>
        )}

        {/* Continue Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-4 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        >
          {loading ? "Sending Reset Link..." : "Send Reset Link"}
        </button>

        {/* Back to Login Link */}
        <div className="text-center">
          <Link
            to="/"
            className="inline-flex items-center text-blue-600 hover:text-blue-500 transition-colors duration-200"
          >
            <ArrowBack style={{ fontSize: 16, marginRight: 8 }} />
            Back to Login Page
          </Link>
        </div>
      </form>

      {/* Footer */}
      <div className="mt-8 pt-6 border-t border-gray-200">
        <p className="text-center text-sm text-gray-600">
          Check your inbox and spam folder for the reset link
        </p>
      </div>
    </div>
  );
};

export default ForgetPasswordContainer;
