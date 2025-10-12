import Backdrop from "@mui/material/Backdrop"; // Import Backdrop from MUI
import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useNavigate } from "react-router-dom";
import PuffLoader from "react-spinners/ClipLoader";
import { useAuth } from "../../context/authContext";
import EaiiLogin from "../Assets/EaiiLoginicon.png";

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
        navigate(`/FirstResettry?userid=${userInfo.foundUser.user_id}`);
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
    <div className="md:w-full max-w-screen-sm mx-auto sm:mt-4 mt-0 md:mt-0 p-4 py-20 bg-white rounded-xl">
      <Helmet>
        <title>PMS - Login</title>
      </Helmet>
      <div className="md:hidden flex justify-center items-center mt-6 mb-4">
        <img src={EaiiLogin} alt="EaiiLogin" className="h-12" />
      </div>
      <div>
        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={open}
        >
          <PuffLoader color="#fff" />
        </Backdrop>
      </div>
      <form onSubmit={handleLogin}>
        <div className="mx-auto space-x-4">
          <div className="grid space-y-2 md:space-y-10 text-center md:mb-4">
            <div className="md:text-3xl text-md font-bold">LOGIN</div>
          </div>

          <div className="font-semibold font-sans">Email</div>
          <div className="relative">
            <input
              type="text"
              className="px-2 py-2 rounded-xl w-full mt-2"
              value={email}
              placeholder="Example@example.com"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="font-semibold font-sans mt-4">Password</div>
          <div>
            <input
              type="password"
              value={password}
              placeholder="Enter your password"
              onChange={(e) => setPassword(e.target.value)}
              className="px-2 py-2 rounded-xl w-full mt-2"
            />
          </div>

          <div className="flex items-center mt-4">
            <input
              type="checkbox"
              id="rememberMe"
              checked={rememberMe}
              onChange={() => setRememberMe(!rememberMe)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded-md"
            />
            <label htmlFor="rememberMe" className="ml-2 text-gray-700">
              Remember Me
            </label>
          </div>

          <div className="mt-4">
            <Link
              to="/forgetpassword"
              className="text-blue-500 hover:underline"
            >
              Forgot Password?
            </Link>
          </div>

          <div className="my-4">
            <button
              type="submit"
              className="bg-blue-900 text-white px-2 py-2 rounded-xl w-full mt-4"
            >
              Login
            </button>
          </div>

          <div className="error-message text-red-600">{errorMessage}</div>
        </div>
      </form>
    </div>
  );
};

export default LoginContainer;
