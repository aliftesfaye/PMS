import React, { useState } from 'react';
import './FirstReset.css';
import Eaii from '../Assets/Reset_logo.png';

const FirstReset = () => {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const togglePasswordVisibility = (field) => {
    switch (field) {
      case 'currentPassword':
        setShowCurrentPassword(!showCurrentPassword);
        break;
      case 'newPassword':
        setShowNewPassword(!showNewPassword);
        break;
      case 'confirmPassword':
        setShowConfirmPassword(!showConfirmPassword);
        break;
      default:
        break;
    }
  };

  return (
    <div className='reset-password-container'>
      <div className='reset-password-container-input'>
        <div className='center-container'>
          <img src={Eaii} alt='Logo' />
       
        <div className='titlee'>
          EAII-PMS 
        </div>
        <div className='subtitlee'>
        Change Password
        </div> </div>
        <div className='sub-subtitle'>
        This is your first time logging in to your account. Please change the password given to you by the admin.
        </div>
       
        <div className="res-group">
          <label htmlFor="currentPassword" className="required">Current Password</label>
          <div className="password-input">
            <input
              className='res-input'
              type={showCurrentPassword ? 'text' : 'password'}
              id="currentPassword"
              name="currentPassword"
              placeholder="Enter current password"
            />
            <i
              className={`password-toggle-icon ${showCurrentPassword ? 'visible' : 'hidden'}`}
              onClick={() => togglePasswordVisibility('currentPassword')}
            ></i>
          </div>
        </div>
        <div className="res-group">
          <label htmlFor="newPassword" className="required">New Password</label>
          <div className="password-input">
            <input
              className='res-input'
              type={showNewPassword ? 'text' : 'password'}
              id="newPassword"
              name="newPassword"
              placeholder="Enter new password"
            />
            <i
              className={`password-toggle-icon ${showNewPassword ? 'visible' : 'hidden'}`}
              onClick={() => togglePasswordVisibility('newPassword')}
            ></i>
          </div>
        </div>
        <div className="res-group">
          <label htmlFor="confirmPassword" className="required">Confirm New Password</label>
          <div className="password-input">
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              id="confirmPassword"
              className='res-input'
              name="confirmPassword"
              placeholder="Re-enter new password"
            />
            <i
              className={`password-toggle-icon ${showConfirmPassword ? 'visible' : 'hidden'}`}
              onClick={() => togglePasswordVisibility('confirmPassword')}
            ></i>
          </div>
        </div>
        <div className="res-buttons">
          <button type="submit">Login</button>
        </div>
      </div>
    </div>
  );
};

export default FirstReset;
