import React from "react";
import backgroundImage from "../Assets/Loginbackground.png";
import EaiiLogin from "../Assets/EaiiLoginicon.png";
import LoginContainer from "./LoginContainer";
import {
  CheckCircle,
  TrendingUp,
  Group,
  OpenInNew,
} from "@mui/icons-material";

const LoginBackground = () => {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      {/* Background Pattern */}
      <div className="absolute inset-0 overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
          style={{ backgroundImage: `url(${backgroundImage})` }}
        />
        <div className="absolute inset-0 bg-black opacity-60"></div>
        {/* Animated gradient orbs */}
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-600 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-600 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
      </div>

      <div className="relative w-full max-w-6xl mx-auto">
        <div className="bg-white/10 backdrop-blur-md rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
          <div className="grid lg:grid-cols-2 gap-0">
            {/* Left Panel - Brand Section */}
            <div className="bg-gradient-to-br from-blue-600/90 to-purple-700/90 p-8 lg:p-12 text-white relative overflow-hidden">
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 left-0 w-32 h-32 bg-white rounded-full -translate-x-16 -translate-y-16"></div>
                <div className="absolute bottom-0 right-0 w-32 h-32 bg-white rounded-full translate-x-16 translate-y-16"></div>
              </div>
              
              <div className="relative z-10 h-full flex flex-col justify-center">
                {/* Logo */}
                <div className="flex justify-center mb-8">
                  <div className="bg-white/20 p-4 rounded-2xl backdrop-blur-sm border border-white/30">
                    <img 
                      src={EaiiLogin} 
                      alt="Ethiopian AI Institute" 
                      className="h-16 w-auto filter brightness-0 invert"
                    />
                  </div>
                </div>

                {/* Institute Info */}
                <div className="text-center mb-8">
                  <h1 className="text-2xl lg:text-3xl font-bold mb-4 leading-tight">
                    Ethiopia Civil Service Commission
                  </h1>
                  <p className="text-xl lg:text-2xl font-semibold text-white/90 mb-2">
                    PROJECT MANAGEMENT SYSTEM
                  </p>
                  <p className="text-white/80 text-sm lg:text-base mt-4">
                    Streamline your projects with intelligent management solutions
                  </p>
                </div>

                {/* Features List */}
                <div className="space-y-3 mb-8">
                  <div className="flex items-center">
                    <CheckCircle style={{ fontSize: 20, color: "#86EFAC", marginRight: 12 }} />
                    <span className="text-white/90">Secure & Reliable Access</span>
                  </div>
                  <div className="flex items-center">
                    <TrendingUp style={{ fontSize: 20, color: "#86EFAC", marginRight: 12 }} />
                    <span className="text-white/90">Real-time Project Tracking</span>
                  </div>
                  <div className="flex items-center">
                    <Group style={{ fontSize: 20, color: "#86EFAC", marginRight: 12 }} />
                    <span className="text-white/90">Collaborative Workspace</span>
                  </div>
                </div>

                {/* Learn More Button */}
                <div className="text-center">
                  <a
                    href="https://fcsc.ecsc.gov.et/"
                    className="inline-flex items-center px-6 py-3 bg-white/20 backdrop-blur-sm border border-white/30 text-white font-semibold rounded-lg hover:bg-white/30 transition-all duration-200 transform hover:-translate-y-0.5"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Learn More About Us
                    <OpenInNew style={{ fontSize: 16, marginLeft: 8 }} />
                  </a>
                </div>
              </div>
            </div>

            {/* Right Panel - Login Form */}
            <div className="bg-white p-8 lg:p-12 flex items-center justify-center">
              <LoginContainer />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-white/70 text-sm">
            © 2025 Federal Democratic Republic of Ethiopia Civil Service Commission. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginBackground;
