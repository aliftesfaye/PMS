import React, { useEffect } from "react";
import axios from "axios";

const TokenRefresher = () => {
  useEffect(() => {
    const refresh = localStorage.getItem("refresh");

    const fetchNewAccessToken = async () => {
      try {
        const response = await axios.post(
          // "http://127.0.0.1:8000/ums/refresh",
          {
            refresh,
          }
        );

        const { access } = response.data;

        localStorage.removeItem("access");

        localStorage.setItem("access", access);
      } catch (error) {}
    };

    fetchNewAccessToken();
  }, []);
};
export default TokenRefresher;
