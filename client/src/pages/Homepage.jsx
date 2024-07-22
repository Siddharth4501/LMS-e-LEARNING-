import React from 'react'
import HomeLayout from '../Layouts/HomeLayout.jsx'
import { Link } from "react-router-dom";
import homePageImg from '../assets/images/homePageMainImage.png';
const Homepage = () => {
  return (
    <>
      <HomeLayout>
        <div className="md:pt-10 pt-20 text-white md:flex items-center justify-center gap-10 min-h-[90vh] px-10 bg-gray-600">
        {/* for platform details */}
        <div className="md:w-1/2 w-auto space-y-6">
          <h1 className="md:text-5xl text-3xl font-semibold">
            Find out best{" "}
            <span className="text-yellow-500 font-bold">Online Courses</span>
          </h1>
          <p className="md:text-xl text-gray-200">
            We have a large library of courses taught by highly skilled and
            qualified faculities at a very affordable cost.
          </p>

          {/* for buttons */}
          <div className="space-x-6">
            <Link to={"/courses"}>
              <button className="bg-yellow-500 px-5 py-3 rounded-md font-semibold md:text-lg text-xl cursor-pointer hover:bg-yellow-600 transition-all ease-in-out duration-300 mb-3">
                Explore Courses
              </button>
            </Link>
            <Link to={"/contact"}>
              <button className="border border-yellow-500 px-5 py-3 rounded-md font-semibold md:text-lg text-xl cursor-pointer hover:border-yellow-600 transition-all ease-in-out duration-300 hover:bg-yellow-500">
                Contact Us
              </button>
            </Link>
          </div>
        </div>

        {/* right section for image */}
        <div className="md:w-1/2  w-auto flex items-center justify-center">
          <img src={homePageImg} alt="home page image" />
        </div>
      </div>
    </HomeLayout>
    </>
  )
}

export default Homepage