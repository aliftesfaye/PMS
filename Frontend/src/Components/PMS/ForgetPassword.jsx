import React from "react";
import backgroundImage from "../Assets/Loginbackground.png";
import "./LoginBackground.css";
import EaiiLogin from "../Assets/EaiiLoginicon.png";
import facebookIcon from "../Assets/facebook.png";
import telegramIcon from "../Assets/telegram.png";
import twitterIcon from "../Assets/twitter.png";
import youtubeIcon from "../Assets/youtube.png";
import linkedinIcon from "../Assets/linkedin.png";
import ResetPasswordbody from "./ResetPasswordbody";
import ForgetPasswordContainer from "./ForgetPasswordContainer";

const ForgetPassword = () => {
  return (
    <section
      className="w-screen h-screen flex items-center justify-center"
      style={{ backgroundImage: `url(${backgroundImage})`, backgroundSize: "cover", backgroundPosition: "center", backgroundRepeat: "no-repeat" }}
    >
      <div className="max-w-[1000px] mx-auto md:grid md:grid-cols-2 items-center sm:p-5 p-2 rounded-2xl shadow-black gap-6  ">
        <div className="sm:w-full">
          <div className="hidden md:flex justify-center sm:mt-4 mt-0 items-center">
            <img src={EaiiLogin} alt="EaiiLogin" className="items-center" />
          </div>

          <div className="hidden md:block text-white font-bold text-center text-sm md:text-xl lg:text-3xl">
            <p>ETHIOPIAN ARTIFICIAL INTELLIGENCE </p>
            <p>INSTITUTE</p>
            PROJECT MANAGEMENT SYSTEM
          </div>
          <div className="hidden md:block my-8 mx-40">
            <a
              href="https://www.aii.et/"
              className="p-3 text-xl rounded-xl bg-white"
              target="_blank"
              rel="noopener noreferrer"
            >
              Learn More
            </a>
          </div>
          <div className="hidden md:flex justify-center items-center gap-3 mt-4">
            <a
              href="https://www.facebook.com/ArtificialIntelligenceInstituteOfficial/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img src={facebookIcon} alt="Facebook" />
            </a>
            <a
              href="https://www.linkedin.com/company/etartificialintelligenceinstitute"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img src={linkedinIcon} alt="Linkedin" />
            </a>
            <a
              href="https://www.youtube.com/@EthiopianAII"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img src={youtubeIcon} alt="Youtube" />
            </a>
            <a
              href="https://t.me/EthiopianAII"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img src={telegramIcon} alt="Telegram" />
            </a>
            <a
              href="https://twitter.com/EthiopianAII/status/1577219636491608065"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img src={twitterIcon} alt="Twitter" />
            </a>
          </div>
        </div>
        <div className="w-fit">
        <ForgetPasswordContainer /></div>
        <div className="md:hidden my-6 mx-24">
          <a
            href="https://www.aii.et/"
            className="p-3 rounded-lg bg-white"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn More
          </a>
        </div>
        <div className="md:hidden flex justify-center gap-3">
          <a
            href="https://www.facebook.com/ArtificialIntelligenceInstituteOfficial/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src={facebookIcon} alt="Facebook" />
          </a>
          <a
            href="https://www.linkedin.com/company/etartificialintelligenceinstitute"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src={linkedinIcon} alt="Linkedin" />
          </a>
          <a
            href="https://www.youtube.com/@EthiopianAII"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src={youtubeIcon} alt="Youtube" />
          </a>
          <a
            href="https://t.me/EthiopianAII"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src={telegramIcon} alt="Telegram" />
          </a>
          <a
            href="https://twitter.com/EthiopianAII/status/1577219636491608065"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src={twitterIcon} alt="Twitter" />
          </a>
        </div>
      </div>
    </section>
  );
};

export default ForgetPassword;
