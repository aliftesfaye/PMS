import React, { useState , useRef } from "react";
import Swal from "sweetalert2";
import { useAuth } from "../../context/authContext";
import apiService from "../services/apiServices";

const Addorganization = ({ handleCloseModal, handlefetchOrganization }) => {
  const [title, SetTitle] = useState("");
  const [file, seFile] = useState(null);  const auth = useAuth();
  const fileInputRef = useRef(null); 

  const [userInfo, setUserInfo] = useState(() => {
    return JSON.parse(localStorage.getItem("userInfo")) || [];
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", title);
    if (file) formData.append("logo", file); 

    try {
      console.log("calling orgn");
      const response = await apiService.Organizationadd(formData);
      console.log("orgn created:", response);
      const Toast = Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 1500,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.onmouseenter = Swal.stopTimer;
          toast.onmouseleave = Swal.resumeTimer;
        },
      });

      Toast.fire({
        icon: "success",
        title: "New Organization has been created",
      }).then(() => {
        handleCloseModal();
        handlefetchOrganization();
      });
    } catch (error) {
      console.error("Error Adding Organization:", error);
      Swal.fire({
        position: "center",
        icon: "error",
        title: "Failed to Odd Organization",
        text: error.response.data.message,
        showConfirmButton: false,
        timer: 2500,
      });
    }
  };
  const resetForm = () => {
    SetTitle("");
    seFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = null; 
    }
  };


  return (
    <div>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="flex flex-col pr-9 pl-20 bg-white rounded-2xl max-w-[500px] h-fit max-md:px-5">
          <div className="self-start text-2xl font-bold text-blue-950">
            Create Organization
          </div>
          <div className="mt-6 max-md:max-w-full">
            <div className="flex gap-5 max-md:flex-col max-md:gap-0">
              <div className="flex flex-col w-6/12 max-md:ml-0 max-md:w-full">
                <div className="flex flex-col grow py-1 text-base max-md:mt-10">
                  <div>
                    Organization Name<span className="required"></span>
                  </div>
                  <input
                    type="text"
                    name="Organization_name"
                    placeholder="Enter Organization Name"
                    value={title}
                    onChange={(e) => SetTitle(e.target.value)}
                    className="justify-center h-14 w-80 items-start px-4 py-5 mt-3.5 text-sm rounded-lg bg-zinc-100 text-slate-950 max-md:pr-5"
                  />
                  <div className="mt-8">Logo</div>
                  <input
  type="file"
  name="documents"
  ref={fileInputRef}
  accept="image/*,image/svg+xml" 
  onChange={(e) => {

    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/svg+xml"];

      if (allowedTypes.includes(selectedFile.type)) {
        seFile(selectedFile);
      } else {
        Swal.fire({
          icon: "error",
          title: "Invalid file type",
          text: "Please upload an image file (JPEG, PNG, GIF) or SVG.",
          showConfirmButton: false,
          timer: 2500,
        });
        fileInputRef.current.value = null;
      }
    }
  }}
  placeholder="Enter Related Documents"
  className="justify-center items-start w-80 h-14 px-4 py-1 mt-3.5 text-sm rounded-lg bg-zinc-100 text-slate-950 max-md:pr-5"
/>


                </div>
              </div>
              <div className="flex flex-col ml-5 w-6/12 max-md:ml-0 max-md:w-full">
                <div className="flex flex-col grow py-1 text-base text-slate-950 max-md:mt-10"></div>
              </div>
            </div>
          </div>
          <div className="flex  mr-10 mt-2 text-base py-4 justify-end">
            <div className="my-auto text-black cursor-pointer ">
            <button
                type="button"
                className="flex justify-center items-center p-2 rounded-lg text-lg w-40 border-[#d73d36] text-[#d73d36] font-bold"
                onClick={resetForm}
              >
                Reset
              </button>

              </div>
            <button
              className="justify-center p-2.5 font-bold text-white  rounded-lg cursor-pointer"
              onClick={handleSubmit}
              style={{ backgroundColor: "#082f49" }}
            >
              Add Organization
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Addorganization;
