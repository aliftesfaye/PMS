import React, { useEffect, useRef, useState } from "react";

const Notification = () => {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      message: "You have been assigned to a new project",
      date: "30 minutes ago",
    },
    {
      id: 2,
      message: "Your request has been approved",
      date: "40 minutes ago",
    },
    {
      id: 3,
      message: "You have been assigned to a new project",
      date: "30 minutes ago",
    },
    {
      id: 4,
      message: "Your request has been approved",
      date: "40 minutes ago",
    },
    {
      id: 5,
      message: "Your request has been approved",
      date: "40 minutes ago",
    },
    {
      id: 6,
      message: "Your request has been approved",
      date: "40 minutes ago",
    },
    {
      id: 7,
      message: "Your request has been approved",
      date: "46 minutes ago",
    },
  ]);

  const [modalOpen, setModalOpen] = useState(false);
  const modalRef = useRef(null);

  useEffect(() => {
    const handleCloseModal = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setModalOpen(false);
      }
    };

    document.addEventListener("mousedown", handleCloseModal);

    return () => {
      document.removeEventListener("mousedown", handleCloseModal);
    };
  }, []);

  const toggleModal = () => {
    setModalOpen((prevModalOpen) => !prevModalOpen);
  };

  const handleDelete = (id) => {
    setNotifications((prevNotifications) =>
      prevNotifications.filter((notification) => notification.id !== id)
    );
  };

  return (
    <div>
      <div className=" flex flex-col pt-4 pr-1.5 pb-1.5 bg-white rounded-lg shadow-md max-w-[373px]">
        <div className="flex gap-1.5">
          <div className="flex flex-col grow shrink-0 basis-0 text-blue-950 w-fit">
            <div className="self-start ml-5 text-xl font-bold">
              Notification
            </div>

            <div className="overflow-y-auto max-h-[400px] ">
              {notifications.slice(0, 6).map((notification) => (
                <div key={notification.id} className="relative">
                  <div className="flex flex-col py-3 pr-2 pl-5 mt-3 w-full bg-white">
                    <div className="flex gap-5 text-sm font-semibold">
                      <div className="flex-auto">{notification.message}</div>
                      <div
                        className="cursor-pointer"
                        onClick={() => handleDelete(notification.id)}
                      >
                        X
                      </div>
                    </div>
                    <div className="mt-3 text-sm">{notification.date}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="flex gap-5 justify-between self-center mt-2 w-full text-base max-w-[330px]">
          <div
            className="justify-center cursor-pointer px-2.5 py-2 font-bold text-white bg-sky-500 rounded-lg"
            onClick={toggleModal}
          >
            View All
          </div>
          <div className="justify-center  cursor-pointer px-2.5 py-2 font-semibold rounded-lg bg-stone-300 text-blue-950">
            Mark as read
          </div>
        </div>
      </div>
      {modalOpen && (
        <div className="fixed top-0  left-0 w-full h-full z-50 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div ref={modalRef} className="w-2/4 bg-white rounded-md relative">
            <span
              className="absolute top-4 right-10 cursor-pointer text-gray-500"
              onClick={toggleModal}
            >
              X
            </span>
            <div className="p-4 ">
              <div className="text-xl font-bold mb-3">Notification</div>
              <div className="overflow-y-auto border-x-2 border-y-2 rounded-xl max-h-[400px] shadow-md">
                {notifications.map((notification) => (
                  <div key={notification.id} className="relative ">
                    <div className="ml-4  flex flex-col border-x-2 border-y-2  py-3 pr-2 pl-5  mt-3 w-relative bg-white">
                      <div className="flex gap-5  text-sm font-semibold">
                        <div className="flex-auto">{notification.message}</div>
                      </div>
                      <div className="mt-3 text-sm">{notification.date}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Notification;
