import React from "react";
import FirstResetbackground from "./FirstResetbackground";
import backgroundImage from "../Assets/Loginbackground.png";

import "./LoginContainer.css";

const FirstResettry = () => {
  return (
    <section
      className="mx-auto h-screen flex items-center justify-center md:h-screen sm:[1027px] backdrop-brightness-0 "
      style={{  backgroundImage: `url(${backgroundImage})`, backgroundColor:"black",backgroundSize:"cover" }}
    >
      <FirstResetbackground />
    </section>
  );
};

export default FirstResettry;
