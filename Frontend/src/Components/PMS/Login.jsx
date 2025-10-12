import React from "react";
import LoginBackground from "./LoginBackground";
import backgroundImage from "../Assets/Loginbackground.png";

import "./LoginContainer.css";

const Login = () => {
  return (
    <section
      className="mx-auto h-screen flex items-center justify-center md:h-screen sm:[1027px] backdrop-brightness-0 "
      style={{  backgroundImage: `url(${backgroundImage})`, backgroundColor:"black",backgroundSize:"cover" }}
    >
      <LoginBackground />
    </section>
  );
};

export default Login;
