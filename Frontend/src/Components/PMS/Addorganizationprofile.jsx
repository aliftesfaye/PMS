import React, { useState } from 'react';
import APIService from '../services/apiServices';

const AddOrganizationProfile = () => {
  const [organizationName, setOrganizationName] = useState('');
  const [acronymName, setAcronymName] = useState('');
  const [selectedSocialMedia, setSelectedSocialMedia] = useState('');
  const [loginPageColor, setLoginPageColor] = useState('#ffffff');
  const [footerColor, setFooterColor] = useState('#ffffff');
  const [headerColor, setHeaderColor] = useState('#ffffff');
  const [loginPageBackgroundImage, setLoginPageBackgroundImage] = useState(null);
  const [copyrightText, setCopyrightText] = useState('');

  const socialMediaOptions = [
    { value: 'facebook', label: 'Facebook' },
    { value: 'twitter', label: 'Twitter' },
    { value: 'instagram', label: 'Instagram' },

];

  const handleSocialMediaChange = (e) => {
    setSelectedSocialMedia(e.target.value);
  };

  const handleLoginPageBackgroundImageChange = (e) => {
    setLoginPageBackgroundImage(URL.createObjectURL(e.target.files[0]));
    document.getElementById('file-name').textContent = e.target.files[0].name;
  };

  const handleAddProfile = () => {
    const data = {
      organizationName,
      acronymName,
      selectedSocialMedia,
      loginPageColor,
      footerColor,
      headerColor,
      loginPageBackgroundImage,
      copyrightText
    };
    APIService.addOrganizationProfile(data)
      .then(response => {

        console.log('Profile added successfully:', response);
      })
      .catch(error => {
        console.error('Error adding profile:', error);
      });
  };

  const ColorPicker = ({ color, setColor }) => {
    const handleChange = (e) => {
      setColor(e.target.value);
    };

    return (
      <div className="flex items-center justify-start px-4 py-3 mt-3 text-sm rounded-lg bg-gray-200 max-md:px-5">
        <input
          type="color"
          value={color}
          onChange={handleChange}
          className="w-6 h-6"
        />
        <span className="ml-3">{color}</span>
      </div>
    );
  };

  return (
    <div className="flex gap-5 items-start py-11 pr-9 pl-20 bg-white rounded-2xl max-w-[925px] max-md:flex-wrap max-md:px-5">
      <div className="flex flex-col grow shrink-0 mt-4 basis-0 w-fit max-md:max-w-full">
        <div className="self-start text-2xl font-bold text-blue-950">
          Add Organization Profile
        </div>
        <div className="mt-6 max-md:max-w-full">
          <div className="flex gap-5 max-md:flex-col max-md:gap-0">
            <div className="flex flex-col w-full max-md:ml-0 max-md:w-full">
              <div className="flex flex-col grow py-1 text-base text-slate-950 max-md:mt-10">
                <div>Organization Name</div>
                <input
                  type="text"
                  value={organizationName}
                  onChange={(e) => setOrganizationName(e.target.value)}
                  className="justify-center items-start px-4  py-6 mt-3 text-sm rounded-lg bg-gray-200 max-md:pr-5"
                />
                <div className="mt-8">Organization Logo</div>
                <label className="cursor-pointer justify-center items-start px-4 py-1 mt-3 text-sm rounded-lg bg-gray-200 max-md:pr-5" >
                  <input className='w-fit' type="file" />
                </label>
                <div className="mt-7">System Header Color</div>
                <ColorPicker color={headerColor} setColor={setHeaderColor} />
                <div className="mt-7">System Footer Color</div>
                <ColorPicker color={footerColor} setColor={setFooterColor} />
                <div className="mt-7">Login Page Background Image</div>
                <label className="cursor-pointer justify-center items-start px-4 py-1 mt-3 text-sm rounded-lg bg-gray-200 max-md:pr-5" >
                  <input
                    className='w-fit'
                    type="file"
                    onChange={handleLoginPageBackgroundImageChange}
                  />
                </label>
              </div>
            </div>
            <div className="flex flex-col ml-5 w-full max-md:ml-0 max-md:w-full">
              <div className="flex flex-col grow py-1 max-md:mt-10">
                <div className="text-base text-slate-950">
                  Organization Acronym Name
                </div>
                <input
                  type="text"
                  value={acronymName}
                  onChange={(e) => setAcronymName(e.target.value)}
                  className="justify-center px-4 items-start  py-6 mt-3 text-sm rounded-lg bg-gray-200 max-md:pr-5"
                />
                <div className="mt-8 text-base text-slate-950">
                  Social Media of Organization
                </div>
                <select
                  value={selectedSocialMedia}
                  onChange={handleSocialMediaChange}
                  className="justify-center items-start h-12  py-3 pl-3   mt-3 text-sm rounded-lg bg-gray-200 max-md:pr-5"
                >
                  <option value="">Select Social Media</option>
                  {socialMediaOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <div className="mt-9">Login Page Background Color</div>
                <ColorPicker color={loginPageColor} setColor={setLoginPageColor} />
                <div className="mt-7 text-base text-slate-950">
                  Copyright Text
                </div>
                <input
                  type="text"
                  value={copyrightText}
                  onChange={(e) => setCopyrightText(e.target.value)}
                  className="flex gap-5 px-5 py-6 mt-3 text-sm rounded-lg bg-gray-200 text-slate-950"
                />
                <div className="flex gap-5 cursor-pointer justify-between self-end mt-16 text-sm max-md:mt-10">
                  <div className="my-auto text-black">Cancel</div>
                  <div className="justify-center p-2.5 font-bold text-white bg-sky-500 rounded-lg" onClick={handleAddProfile}>
                    Add Profile
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddOrganizationProfile;
