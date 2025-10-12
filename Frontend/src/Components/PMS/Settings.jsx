import React from 'react'
import Member1 from '../Assets/Member1.png';


const Settings = () => {
  return (
    <div className=''>
     <div className=" flex flex-col text-sm font-bold max-w-[913px]">
      <div className="flex flex-col justify-center items-end py-4 pr-2.5 pl-12 w-full text-sm text-white bg-white max-md:pl-5 max-md:max-w-full">
        <div className=" justify-center px-3.5 py-2.5 bg-sky-500 rounded-md">
          Add Profile
        </div>
      </div>
      <div className=" flex  py-4 pl-9 w-full text-black bg-white max-md:flex-wrap max-md:pl-5 max-md:max-w-full">
        <div className=" my-auto">Organization Name</div>
        <div className="   flex  ml-52   items-center text-center max-md:flex-wrap">
          <div className="  flex-1 mr-16 self-stretch my-auto">Logo</div>
          <div className="self-stretch mr-10 my-auto">Acronym Name</div>
          <div className=' w-32 mr-10'>Login Page Background Image</div>
          <div className="flex-1 self-stretch my-auto">Action</div>
        </div>
      </div>
      <div className="flex   py-3.5 pl-9 font-medium bg-purple-50 max-md:flex-wrap max-md:pl-5 max-md:max-w-full">
          <div className="w-44 text-xs">
            Ethiopian Artificial kldjflkjldkjfl ldkjfl Intelligence Institute
          </div>
          <div className=" ml-14 flex  px-1 whitespace-nowrap">
            <img
              loading="lazy"
src={Member1}         
alt= ''
className="shrink-0 w-8 aspect-square"
            />
          </div>
          <div className="acronym">EAII</div>
        
        <div className="flex ">
          <div className="back-ground flex  text-black">
            <img
              loading="lazy"
src={Member1} 
alt=''
className="shrink-0 w-12 "
            />
          </div>
            <div className="flex flex-col justify-center">
              <div className="justify-center px-2.5 py-2 bg-sky-500 rounded-md">
                Show
              </div>
            </div>
            <div className="flex flex-col justify-center">
              <div className="justify-center px-2.5 py-2 bg-amber-500 rounded-md">
                Edit
              </div>
            </div>
        </div>
      </div>
    </div>
    </div>
  )
}

export default Settings
