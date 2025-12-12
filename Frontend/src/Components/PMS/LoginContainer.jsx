import Backdrop from "@mui/material/Backdrop";
import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useNavigate } from "react-router-dom";
import PuffLoader from "react-spinners/ClipLoader";
import { useAuth } from "../../context/authContext";
import {
  Lock,
  Email,
  ErrorOutline,
} from "@mui/icons-material";

const LoginContainer = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
  const [open, setOpen] = useState(false);

  const navigate = useNavigate();
  const auth = useAuth();

  useEffect(() => {
    const rememberedEmail = localStorage.getItem("rememberedEmail");
    const rememberedPassword = localStorage.getItem("rememberedPassword");
    const remembered = localStorage.getItem("rememberMe") === "true";

    if (rememberedEmail && rememberedPassword && remembered) {
      setEmail(rememberedEmail);
      setPassword(rememberedPassword);
      setRememberMe(true);
    }
  }, []);

  const handleLogin = async (event) => {
    event.preventDefault();
    setOpen(true);
    const userInfo = await auth.login(email, password);

    if (userInfo && Object.keys(userInfo).length > 0) {
      if (rememberMe) {
        localStorage.setItem("rememberedEmail", email);
        localStorage.setItem("rememberedPassword", password);
        localStorage.setItem("rememberMe", "true");
      } else {
        localStorage.removeItem("rememberedEmail");
        localStorage.removeItem("rememberedPassword");
        localStorage.setItem("rememberMe", "false");
      }

      if (userInfo.foundUser.first_time_status === false) {
        setOpen(false);
        navigate(`/FirstReset?userid=${userInfo.foundUser.user_id}`);
      } else {
        navigate("/home");
      }
    } else {
      setOpen(false);
      setErrorMessage("Invalid email or password.");
    }
  };

  useEffect(() => {
    setIsUserLoggedIn(auth.userInfo);
  }, [auth.userInfo]);

  return (
    <div className="w-full max-w-md mx-auto p-8 bg-white rounded-2xl border border-gray-100">
      <Helmet>
        <title>PMS - Login</title>
      </Helmet>

      {/* Loading Backdrop */}
      <div>
        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={open}
        >
          <PuffLoader color="#fff" />
        </Backdrop>
      </div>

      {/* Header */}
      <div className="text-center mb-8">
        <div className="mb-2">
          <div className="w-16 h-16 bg-gradient-to-r from-sky-900 via-sky-800 to-sky-900 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock style={{ fontSize: 32, color: "white" }} />
          </div>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Welcome Back</h1>
        <p className="text-gray-600">Sign in to your account</p>
      </div>

      <form onSubmit={handleLogin}>
        <div className="space-y-6">
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
                placeholder="Example@example.com"
                onChange={(e) => setEmail(e.target.value)}
              />
              <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                <Email style={{ fontSize: 20, color: "#9CA3AF" }} />
              </div>
            </div>
          </div>

          {/* Password Field */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type="password"
                value={password}
                placeholder="Enter your password"
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 pl-11 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
              <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                <Lock style={{ fontSize: 20, color: "#9CA3AF" }} />
              </div>
            </div>
          </div>

          {/* Remember Me & Forgot Password */}
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="rememberMe"
                checked={rememberMe}
                onChange={() => setRememberMe(!rememberMe)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="rememberMe" className="ml-2 text-sm text-gray-700">
                Remember Me
              </label>
            </div>
            <Link
              to="/forgetpassword"
              className="text-sm text-blue-600 hover:text-blue-500 transition-colors duration-200"
            >
              Forgot Password?
            </Link>
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <div className="flex items-center">
                <ErrorOutline style={{ fontSize: 20, color: "#F87171", marginRight: 8 }} />
                <span className="text-red-700 text-sm">{errorMessage}</span>
              </div>
            </div>
          )}

          {/* Login Button */}
          <div className="my-4">
            <button
              type="submit"
              className="bg-blue-900 text-white px-2 py-2 rounded-xl w-full mt-4"
            >
              Login
            </button>
          </div>
        </div>
      </form>

      {/* Footer */}
      <div className="mt-8 pt-6 border-t border-gray-200">
        <p className="text-center text-sm text-gray-600">
          Secure access to your project management system
        </p>
      </div>
    </div>
  );
};

export default LoginContainer;
