import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // Import Axios
import './Signin.css';


import SigninImage from '../Assets/signin.png';
import Loginlogo from '../Assets/login_logo.png';

const Signin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      console.log('Email:', email);
      console.log('Password:', password);

      const response = await axios.post('http://172.20.10.2:5000/ums/login', {
        email,
        password,
      });

      console.log('API Response:', response);

      navigate('/sideandnav');
    } catch (error) {
      console.error('Login failed:', error.message);
      setErrorMessage('Wrong password or email');
    }
  };
  return (
    <div className='Signin_container'>
      <img src={SigninImage} alt="Signin" className="signin-image" />
      <div className="boxx">
        <div className='siginfieldcontainer'>
          <div className='loginlogo'>
            <img src={Loginlogo} alt="Login" />
          </div>
          <div className='login_name'>EAII-PMS</div>
          <div className="signin-txts">Email</div>
          <div className="signin-input">
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="signin-txts">Password</div>
          <div className="signin-input">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="remember-me-and-link">
            <div className="remember-me">
              <div className='check-box'>
                <input
                  type="checkbox"
                  id="rememberMe"
                  checked={rememberMe}
                  onChange={() => setRememberMe(!rememberMe)}
                />
              </div>
              <label htmlFor="rememberMe">Remember Me</label>
            </div>
            <a href="/reset-password" className="reset-password-link">
              Reset Password?
            </a>
          </div>

          <button className="signin-button" onClick={handleLogin}>
            Login
          </button>

          <div className="error-message" style={{ color: 'red' }}>
            {errorMessage}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signin;
