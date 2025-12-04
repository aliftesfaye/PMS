import axios from "axios";
import React, { createContext, useContext, useState } from "react";
import Swal from "sweetalert2";

import { BASE_URL } from "../config";

const instance = axios.create({
  baseURL: BASE_URL,
  // headers: { "ngrok-skip-browser-warning": true },
});

const AuthContext = createContext();
const AuthProvider = ({ children }) => {
  const [userInfo, setUserInfo] = useState({});
  const [authToken, setAuthToken] = useState("");
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);

  const login = async (email, password) => {
    try {
      const response = await instance.post("/ums/login", { email, password });
      const responseData = response.data;
      if (response.statusText === "OK") {
        localStorage.removeItem("userInfo");
        localStorage.removeItem("permissions");
        localStorage.removeItem("selectedLink");
        localStorage.removeItem("selectedProjectInfo");
        localStorage.removeItem("project_permissions");
        localStorage.removeItem("isProjectSelected");
        localStorage.removeItem("showDropdown");
        const info = await responseData;
        localStorage.setItem("userInfo", JSON.stringify(info));
        console.log(responseData);
        await isLoggedIn();
        return info;
      }
    } catch (error) {
      console.log(error);
      let errorMessage;
      if (error.response) {
        if (error.response.status === 400) {
          errorMessage = error.response.data.message;
        } else if (error.response.status === 401) {
          errorMessage = error.response.data.message;
        } else if (error.response.status === 402) {
          errorMessage = error.response.data.message;
        } else {
          errorMessage = "Server Error";
        }
      } else {
        errorMessage = "Network Error";
      }
    }
  };

  const logout = async () => {
    try {
      setIsUserLoggedIn(false);
      localStorage.removeItem("userInfo");
      localStorage.removeItem("permissions");
      localStorage.removeItem("selectedLink");
      localStorage.removeItem("selectedProjectInfo");
      localStorage.removeItem("project_permissions");
      localStorage.removeItem("isProjectSelected");
      localStorage.removeItem("showDropdown");

      setUserInfo({});
    } catch (error) {
      console.log(error);
      // throw error;
    }
  };

  const getPermissions = async (role) => {
    try {
      // const role = await apiService.getRoleById(role_id);
      localStorage.setItem("permissions", JSON.stringify(role.Permissions));
    } catch (e) {
      console.log(e);
    }
  };

  const isLoggedIn = async () => {
    try {
      let userInfo = localStorage.getItem("userInfo");
      userInfo = JSON.parse(userInfo);
      if (userInfo) {
        setUserInfo(userInfo);
        const mainRole = userInfo.foundUser.Roles.find(
          (role) => role.project_related === false
        );
        await getPermissions(mainRole);
        setAuthToken(userInfo.refreshToken);
        setIsUserLoggedIn(true);
      }
    } catch (e) {
      console.log(`is logged in error ${e}`);
    }
  };
  const value = {
    userInfo,
    login,
    logout,
    isLoggedIn,
    authToken,
    isUserLoggedIn,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

const useAuth = () => {
  return useContext(AuthContext);
};

export { AuthProvider, useAuth };
