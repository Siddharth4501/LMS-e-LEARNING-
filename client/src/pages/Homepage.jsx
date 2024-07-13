import React from 'react'
import HomeLayout from '../Layouts/HomeLayout.jsx'
import { Link } from "react-router-dom";
import homePageImg from '../assets/images/HomeImage4.jpg';
const Homepage = () => {
  return (
    <>
      <HomeLayout>
        <div className="pt-10 text-white flex items-center justify-center gap-10 h-[90vh] px-10 bg-gray-600">
        {/* for platform details */}
        <div className="w-1/2 space-y-6">
          <h1 className="text-5xl font-semibold">
            Find out best{" "}
            <span className="text-yellow-500 font-bold">Online Courses</span>
          </h1>
          <p className="text-xl text-gray-200">
            We have a large library of courses taught by highly skilled and
            qualified faculities at a very affordable cost.
          </p>

          {/* for buttons */}
          <div className="space-x-6">
            <Link to={"/courses"}>
              <button className="bg-yellow-500 px-5 py-3 rounded-md font-semibold text-lg cursor-pointer hover:bg-yellow-600 transition-all ease-in-out duration-300">
                Explore Courses
              </button>
            </Link>
            <Link to={"/contact"}>
              <button className="border border-yellow-500 px-5 py-3 rounded-md font-semibold text-lg cursor-pointer hover:border-yellow-600 transition-all ease-in-out duration-300">
                Contact Us
              </button>
            </Link>
          </div>
        </div>

        {/* right section for image */}
        <div className="w-1/2 flex items-center justify-center">
          <img src={homePageImg} alt="home page image" style={{borderRadius:'50px',maxHeight:'450px',maxWidth:'650px'}} />
        </div>
      </div>
    </HomeLayout>
    </>
  )
}

export default Homepage