import React from 'react';
import mypp from '../Assets/mypp.png';
import completed from '../Assets/Completed.svg';
import assigned from '../Assets/Vector.svg';
import emailIcon from '../Assets/email.png';

const Viewprofile = () => {
    const profileImage = mypp;
    const expertise = "UI Designer";
    const fullName = "Abebe Kebede";
    const emailAddress = "abekebe@gmail.com";
    const totalTasks = 5;
    const assignedTasks = 3;
    const completedTasks = 2;
    const workedOnProjects = [
        "Project Management System",
        "Anti-corruption Commission System",
        "AA police Commission System",
        "AA police Commission System",

    ];
    const currentTasks = [
        { projectName: "Smart Court System", status: "Inprogress", milestone: "Web Design" },
        { projectName: "Customs Commission System", status: "Inprogress", milestone: "Mobile App Design" },
        { projectName: "User Management System", status: "Inprogress", milestone: "Login Page Design" }
    ];

    return (
        <div className="view-profile-container flex flex-col  pr-9 pl-2  rounded-2xl  max-md:px-5">
            <div className="title-profile-view mb-4 text-2xl font-bold text-blue-950">
                User profile
            </div>
            <div className="view-container  max-md:max-w-full">
                <div className="  flex h-96 max-md:flex-col max-md:gap-0">
                    <div className="workedon-and-user-profile-container  flex flex-col max-md:ml-0 max-md:w-full ">
                        <div className="flex flex-col max-md:mt-9">
                        <div className="profile-container-box flex flex-col  py-5 mt-3 bg-white w-fit h-fit rounded-2xl border-solid border-black border-opacity-50 max-md:px-5 shadow-lg">
                                <div className="profile-cont flex  pr-1.5">
                                    <div className="right-side ml-4 flex flex-col justify-center items-center">
                                        <img
                                            loading="lazy"
                                            src={profileImage}
                                            alt=''
                                            className="rounded-full aspect-[1.08] w-[102px]"
                                        />
                                        <div className="experties justify-center px-1.5 py-1.5 mt-3.5 bg-sky-200 rounded-lg">
                                            {expertise}
                                        </div>
                                    </div>
                                    <div className="border-l ml-2 border-gray-300"></div>

                                    <div className="left-side ml-4">

                                        <div className="Fullname text-base">{fullName}</div>
                                        
                                        <div className="email mb-1 flex w-fit gap-1 mt-1 text-black whitespace-nowrap">
                                            <img
                                                loading="lazy"
                                                src={emailIcon}
                                                alt=''
                                                className="size-fit mt-2"
                                            />
                                            <div>{emailAddress}</div>
                                        </div>
                                        <div className="border-t  border-gray-300"></div>

                                        <div className="total-task ">Total tasks {totalTasks}</div>
                                        <div className="progress flex gap-2.5 mt-1 whitespace-nowrap">
                                            <img
                                                loading="lazy"
                                                src={assigned}
                                                alt=""
                                                className=""
                                            />
                                            <div className="assigned">{assignedTasks}</div>
                                        </div>
                                        <div className="flex gap-2.5  whitespace-nowrap">
                                            <img
                                                loading="lazy"
                                                src={completed}
                                                alt=''
                                                className="shrink-0 w-3.5 aspect-[1.08] fill-lime-600"
                                            />
                                            <div className="">{completedTasks}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="workedon-container-box  flex flex-col py-2 mt-2 bg-white rounded-2xl border-solid border-black border-opacity-50 max-md:px-5 shadow-lg">
    <div className="workedon-title text-xl ml-6 font-bold text-blue-950">Worked on</div>
    <div className={`workedon-container ${workedOnProjects.length > 3 ? 'max-h-32  overflow-y-auto' : ''} flex flex-col px-2  ml-6 mt-2.5 w-fit bg-white rounded-lg border-0 border-solid h-32 shadow-sm border-black border-opacity-50`}>
        {workedOnProjects.map((project, index) => (
            <div key={index} className="flex gap-2">
                <div className="flex flex-col justify-center mt-1 text-lg font-semibold text-white whitespace-nowrap">
                    <div className="initial pl-2 mb-3 justify-center items-center w-7 h-7 rounded bg-slate-500">
                        {project.charAt(0)}
                    </div>
                </div>
                <div className="project-title flex-1 my-auto text-xs font-medium text-black">
                    {project}
                </div>
            </div>
        ))}
    </div>
</div>


                        </div>
                    </div>
<div className="flex flex-col ml-5 w-fit max-md:ml-0 max-md:w-full">
                    <div className="currenttask-box flex flex-col px-9 py-5 mt-3 rounded-2xl border-solid  overflow-y-scroll border-black border-opacity-50 max-md:px-5 shadow-lg" >
                            <div className="text-xl font-bold text-blue-950">
                                Current Task
                            </div>
                            {currentTasks.map((task, index) => (
                                <div key={index} className="project-container-box flex flex-col px-1 py-5 mt-2.5 w-3/4 bg-white rounded-lg border-solid shadow-sm border-black border-opacity-50">
                                    <div className="flex gap-5 justify-between px-0.5">
                                        <div className="flex gap-2">
                                            <div className="flex flex-col  text-lg font-semibold text-white whitespace-nowrap">
                                                <div className="initial px-2 justify-center items-center bg-blue-600 rounded-sm">
                                                    {task.projectName.charAt(0)}
                                                </div>
                                            </div>
                                            <div className="project-title my-auto text-xs font-medium text-black">
                                                {task.projectName}
                                            </div>
                                        </div>
                                        <div className="  px-2.5 py-1.5 my-auto text-xs font-medium text-red-800 whitespace-nowrap bg-orange-300 rounded-2xl">
                                            {task.status}
                                        </div>
                                    </div>
                                    <div className="milestone justify-center w-fit px-1.5 py-1.5 mt-6 text-base  font-semibold bg-sky-200 rounded-md inline-block text-slate-900">
                                        {task.milestone}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Viewprofile;
