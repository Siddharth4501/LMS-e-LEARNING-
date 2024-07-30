import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import HomeLayout from "../../Layouts/HomeLayout";
import { getUserData } from "../../Redux/Slices/AuthSlice.js";
import { cancelCourseBundle } from "../../Redux/Slices/RazorpaySlice.js";

const Profile = () => {
  const dispatch = useDispatch();

  const userData = useSelector((state) => state?.auth?.data);
  
  // function to handle the cancel subscription of course
  const handleCourseCancelSubscription = async () => {
    await dispatch(cancelCourseBundle());
    await dispatch(getUserData());
  };

  useEffect(() => {
    // getting user details
    dispatch(getUserData());
  }, []);
  return (
    <HomeLayout>
      <div className="min-h-[90vh] flex items-center justify-center bg-gray-600">
        <div className="my-10 flex flex-col gap-4 rounded-lg p-4 text-white sm:min-w-80 min-w-[70vw] shadow-[0_0_10px_black] bg-gray-800">
          <img
            className="sm:w-40 w-20 m-auto rounded-full border border-black"
            src={userData?.avatar?.secure_url}
            alt="user profile image"
          />

          <h3 className="text-xl font-semibold text-center capitalize">
            {userData.fullName}
          </h3>

          <div className="grid sm:grid-cols-2">
            <p>Email :</p>
            <p>{userData?.email}</p>
            <p>Role :</p>
            <p>{userData?.role}</p>
            <p>Subscription :</p>
            <p>
              {userData?.subscription?.status === "active"
                ? "Active"
                : "Inactive"}
            </p>
          </div>

          {/* button to change the password */}
          <div className="flex sm:flex-row flex-col items-center justify-between gap-2">
            <Link
              to={
                userData?.email === "test@gmail.com"
                  ? "/denied"
                  : "/changepassword"
              }
              className="sm:w-1/2 w-full bg-yellow-600 hover:bg-yellow-700 transition-all ease-in-out duration-300 rounded-sm py-2 font-semibold cursor-pointer text-center"
            >
              <button>Change Password</button>
            </Link>

            <Link
              to={
                userData?.email === "test@gmail.com"
                  ? "/denied"
                  : "/user/editprofile"
              }
              className="sm:w-1/2 w-full border border-yellow-600 hover:border-yellow-500 transition-all ease-in-out duration-300 rounded-sm py-2  font-semibold cursor-pointer text-center"
            >
              <button>Edit Profile</button>
            </Link>
          </div>

          {userData?.subscription?.status === "active" && (
            <button
              onClick={handleCourseCancelSubscription}
              className="w-full bg-red-600 hover:bg-red-500 transition-all ease-in-out duration-300 rounded-sm py-2 font-semibold cursor-pointer text-center"
            >
              Cancel Subscription
            </button>
          )}
        </div>
      </div>
    </HomeLayout>
  );
};

export default Profile;
