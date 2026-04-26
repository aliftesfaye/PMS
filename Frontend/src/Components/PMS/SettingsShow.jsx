import React from 'react';
import logo from "../Assets/settinglogo.png";
import bg from '../Assets/bg.png';
import browser from '../Assets/browser.png';
import facebook from '../Assets/facebook.png';
import youtube from '../Assets/youtube.png';

const SettingsShow = () => {
  const acronymName = "EAII-PMS";
  const loginPageBackgroundColor = "#000000";
  const systemHeaderColor = "#FFFFFF";
  const systemFooterColor = "#FFFFFF";
  const copyrightText = "@Federal Civil Service Commission";

  return (
    <div>
      <div className="flex gap-5 items-start py-12 pr-9 pl-20 text-black bg-white rounded-2xl max-md:flex-wrap max-md:px-5">
        <div className="flex flex-col grow shrink-0 mt-4 basis-0 w-fit max-md:max-w-full">
          <div className="text-2xl font-bold text-blue-950 max-md:mr-2.5 max-md:max-w-full">
            Federal Civil Service Commission
          </div>
          <div className="flex gap-5 justify-between mt-8 max-w-full text-sm whitespace-nowrap w-[100px]">
            <div className="my-auto font-bold">Logo</div>
            <div className="flex gap-2 font-medium">
              <img
                loading="lazy"
                src={logo}
                alt=''
                className="shrink-0 w-12 "
              />
            </div>
          </div>
          <div className="flex gap-5 self-start mt-4">
            <div className="text-sm font-bold">Acronym Name</div>
            <div className="justify-center py-1.5 text-xs italic whitespace-nowrap">
              {acronymName}
            </div>
          </div>
          <div className="flex gap-5 self-start mt-4 text-sm">
            <div className="font-bold">Login Page Background Image</div>
            <div className="flex gap-2 my-auto font-medium whitespace-nowrap">
              <img
                loading="lazy"
                src={bg}
                alt=''
                className="shrink-0 w-12 aspect-[1.49]"
              />
            </div>
          </div>
          <div className="shrink-0 mt-5 h-px  border-solid w-80  bg-black bg-opacity-30 border-black border-opacity-30 max-md:max-w-full" />
          <div className="self-start mt-5 text-sm font-bold">
            Social Medias of Organization
          </div>
          <div className="flex gap-5 self-start mt-4 text-xs whitespace-nowrap">
            <img
              src={browser}
              alt=''
              className="shrink-0 w-5 aspect-square fill-black"
            />
            <div className="flex-auto my-auto italic">www.aii.et</div>
          </div>
          <div className="flex gap-5 self-start mt-4 text-xs whitespace-nowrap">
            <img
              loading="lazy"
              src={facebook}
              alt=''
              className="shrink-0 w-5 "
            />
            <div className="flex-auto italic">www.fb.com/EAII</div>
          </div>
          <div className="flex gap-5 self-start py-0.5 mt-4 text-xs whitespace-nowrap">
            <img
              loading="lazy"
              src={youtube}
              alt=''
              className="shrink-0 w-5 "
            />
            <div className="flex-auto italic">www.youtube.com/@EAII</div>
          </div>
          <div className="shrink-0 mt-5 h-px  border-solid bg-black bg-opacity-30 w-80 border-black border-opacity-30 max-md:max-w-full" />
          <div className="flex gap-5 py-px mt-4 max-md:flex-wrap">
            <div className="text-sm font-bold">Login Page Background Color</div>
            <div className="flex gap-1.5 my-auto text-xs whitespace-nowrap">
              <div className="shrink-0 w-5 h-5 bg-white  border-black border-solid" />
              <div className="flex-auto my-auto italic">{loginPageBackgroundColor}</div>
            </div>
          </div>
          <div className="flex gap-5 py-px mt-4 max-md:flex-wrap">
            <div className="text-sm font-bold">System Header Color</div>
            <div className="flex gap-1.5 my-auto text-xs whitespace-nowrap">
              <div className="shrink-0 w-5 h-5 bg-white  border-black border-solid" />
              <div className="flex-auto my-auto italic">{systemHeaderColor}</div>
            </div>
          </div>
          <div className="flex gap-5 py-px mt-4 max-md:flex-wrap">
            <div className="text-sm font-bold">System Footer Color</div>
            <div className="flex gap-1.5 my-auto text-xs whitespace-nowrap">
              <div className="shrink-0 w-5 h-5 bg-white  border-black border-solid" />
              <div className="flex-auto my-auto italic">{systemFooterColor}</div>
            </div>
          </div>
          <div className="flex gap-5 py-px mt-4 max-md:flex-wrap">
            <div className="text-sm font-bold">Copyright Text</div>
            <div className="flex gap-1.5 my-auto text-xs whitespace-nowrap">
              <div className="shrink-0 w-5 h-5 bg-white  border-black border-solid" />
              <div className="flex-auto my-auto italic">{copyrightText}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SettingsShow;
