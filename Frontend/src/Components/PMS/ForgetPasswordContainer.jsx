import Backdrop from "@mui/material/Backdrop";
import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import PuffLoader from "react-spinners/ClipLoader";
import apiService from "../services/apiServices";

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
    <div className=" bg-white p-16 rounded-2xl mr-12 w-full">
      <Helmet>
        <title>PMS - Forget Password</title>
      </Helmet>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
      >
        <PuffLoader color="#fff" />
      </Backdrop>
      <div className="flex flex-col items-center ">
        <div className="mt-5 text-2xl font-semibold">Forgot Password</div>
        <div className="mt-5  text-base tracking-normal leading-6 text-justify text-zinc-500">
          Enter your email for the verification process, we will send a link to
          your email for changing your password.
        </div>{" "}
      </div>
      <form onSubmit={handleSubmit}>
        <div className="mt-9 ">Email</div>
        <div className="flex flex-col">
          <input
            type="email"
            className=" py-5 mt-3 px-3 text-sm w-full rounded-lg"
            value={email}
            onChange={handleEmailChange}
            placeholder="example@gmail.com"
            required
          />
          <button
            className="mt-4 p-2 bg-blue-500 text-white rounded-md w-full"
            disabled={loading}
          >
            {loading ? "Sending..." : "Continue"}
          </button>
        </div>
        <div className=" mt-6 ">
          <Link
            to="/"
            className="text-blue-500 flex justify-center hover:underline"
          >
            Back to Login Page
          </Link>
        </div>
      </form>
      {error && <div className="text-red-500 mt-4">{error}</div>}
      {successMessage && (
        <div className="text-green-500 mt-4">{successMessage}</div>
      )}
    </div>
  );
};

export default ForgetPasswordContainer;
