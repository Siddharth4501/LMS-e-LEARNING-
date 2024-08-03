import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import CourseCard from "../../components/CourseCard.jsx";
import HomeLayout from "../../Layouts/HomeLayout.jsx";

import { getAllCourses } from "../../Redux/Slices/CourseSlice.js";

const Courses = () => {
  const dispatch = useDispatch();
  const { coursesData } = useSelector((state) => state.course);
  console.log("mrsfnejgojrioejg",coursesData)
  useEffect(() => {
    (async () => {
      await dispatch(getAllCourses());
    })();
  }, []);

  return (
    <HomeLayout>
      {/* courses container for displaying the cards */}
      <div className="min-h-[90vh] pt-12 lg:pl-20 flex flex-col flex-wrap gap-10 text-white bg-gray-600">
        <h1 className="text-center sm:mt-0 mt-5 text-3xl  font-semibold">
          Explore the courses made by{" "}
          <span className="font-bold text-yellow-500">Industry Experts</span>
        </h1>

        {/* wrapper for courses card */}
        <div className="mb-10 lg:w-auto w-full flex flex-wrap gap-14">
          {coursesData?.map((element) => {
            return <CourseCard key={element._id} data={element} />;
          })}
        </div>
      </div>
    </HomeLayout>
  );
};

export default Courses;
