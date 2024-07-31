import fs from 'fs/promises'
import path from 'path';

import cloudinary from 'cloudinary';
import Course from '../models/course.model.js';
import AppError from '../utils/error.utils.js';

const getAllCourses=async(req,res,next)=>{
    
    const courses=await Course.find({}).select('-lectures');
    
    res.status(200).json({
        success:true,
        message:'All courses',
        courses,
    });

}
const createCourse=async (req,res,next)=>{
    try{
        const {title,description,category,createdBy}=req.body;
        if(!title,!description,!category,!createdBy){
            return next(new AppError('All fields are required',400))
        }
        const course=await Course.create({
            title,
            description,
            category,
            createdBy,
        })
        if(!course){
            return next(new AppError('Course could not be created please try again',400))
        }

        if(req.file){
            const result=await cloudinary.v2.uploader.upload(req.file.path,{// path,secure url,public id is provided by cloudinary
                folder:'lms'
            });
            if(result){
                course.thumbnail.public_id=result.public_id,
                course.thumbnail.secure_url=result.secure_url;
            }
            fs.rm(`uploads/${req.file.filename}`);
        }
        await course.save();

        res.status(200),json({
            success:true,
            message:'Course created successfully',
            course,
        })
    }catch(e){
        if(req.file){
            fs.rm(`uploads/${req.file.filename}`);
        }
        return next(new AppError(e.message,500))
    }
}

const getLecturesByCourseId=async(req,res,next)=>{
    const { id } = req.params;

    const course = await Course.findById(id);

    if (!course) {
        return next(new AppError('Invalid course id or course not found.', 404));
    }

    res.status(200).json({
        success: true,
        message: 'Course lectures fetched successfully',
        lectures: course.lectures,
    });
}

const updateCourse=async(req,res,next)=>{
    try{
        const {id}=req.params;
        const course=await Course.findByIdAndUpdate(
            id,
            {
                $set:req.body //it overrides previos data by req.boy data
            },
            {
                runValidators:true //it checks schema validations when new data ovverrides previous data
            })
        if(!course){
            return next(new AppError('Courses with given id does not exis',500))
        }
        res.status(200).json({
            success:true,
            message:'Course updated successfully',
            course,
        })
    }
    catch(e){
        return next(new AppError(e.message,500))
    }

}

const removeCourse=async(req,res,next)=>{
    try{
        const {id}=req.params;
        const course=await Course.findById(id);
        if(!course){
            return next(new AppError('Courses with given id does not exis',500))
        }
        await Course.findByIdAndDelete(id);
        res.status(200).json({
            success:true,
            message:'Course deleted successfully',
        })
    }

    catch(e){
        return next(new AppError(e.message,500))
    }
}

const addLectureToCourseById=async(req,res,next)=>{
    const { title, description } = req.body;
    const { id } = req.params;
    console.log("test4")
    let lectureData = {
        public_id:'',
        secure_url:'',
    };

    if (!title || !description) {
        return next(new AppError('Title and Description are required', 400));
    }

    const course = await Course.findById(id);
    console.log("test5")
    if (!course) {
        return next(new AppError('Invalid course id or course not found.', 400));
    }

    // Run only if user sends a file
    if (req.file) {
        try {
            console.log("test6")
            const result = await cloudinary.v2.uploader.upload(req.file.path, {
                folder: 'lms', // Save files in a folder named lms
                chunk_size: 50000000, // 50 mb size
                resource_type: 'video',
            });

            // If success
            if (result) {
                console.log("test7",result)
                console.log("sid1",result.public_id)
                console.log("sid2",result.secure_url)
                // Set the public_id and secure_url in array
                lectureData.public_id = result.public_id;
                lectureData.secure_url = result.secure_url;
            }
            console.log("test8")
            // After successful upload remove the file from local storage
            fs.rm(`uploads/${req.file.filename}`);
        } catch (error) {
        // Empty the uploads directory without deleting the uploads directory
            for (const file of await fs.readdir('uploads/')) {
                await fs.unlink(path.join('uploads/', file));
            }

            // Send the error message
            return next(
                new AppError(
                JSON.stringify(error) || 'File not uploaded, please try again',
                400
                )
        );
        }
    }

    course.lectures.push({
        title,
        description,
        lecture: lectureData,
    });

    course.numberOfLectures = course.lectures.length;
    console.log("test9",course)
    // Save the course object
    await course.save();
    
    console.log("test10")
    res.status(200).json({
        success: true,
        message: 'Course lecture added successfully',
        course,
    });
}
const removeLectureFromCourse=async(req,res,next)=>{
    // Grabbing the courseId and lectureId from req.query
  const { courseId, lectureId } = req.query;

  console.log(courseId);

  // Checking if both courseId and lectureId are present
  if (!courseId) {
    return next(new AppError('Course ID is required', 400));
  }

  if (!lectureId) {
    return next(new AppError('Lecture ID is required', 400));
  }

  // Find the course uding the courseId
  const course = await Course.findById(courseId);

  // If no course send custom message
  if (!course) {
    return next(new AppError('Invalid ID or Course does not exist.', 404));
  }

  // Find the index of the lecture using the lectureId
  const lectureIndex = course.lectures.findIndex(
    (lecture) => lecture._id.toString() === lectureId.toString()
  );

  // If returned index is -1 then send error as mentioned below
  if (lectureIndex === -1) {
    return next(new AppError('Lecture does not exist.', 404));
  }

  // Delete the lecture from cloudinary
  await cloudinary.v2.uploader.destroy(
    course.lectures[lectureIndex].lecture.public_id,
    {
      resource_type: 'video',
    }
  );

  // Remove the lecture from the array
  course.lectures.splice(lectureIndex, 1);

  // update the number of lectures based on lectres array length
  course.numberOfLectures = course.lectures.length;

  // Save the course object
  await course.save();

  // Return response
  res.status(200).json({
    success: true,
    message: 'Course lecture removed successfully',
  });


}
export {
    getAllCourses,
    createCourse,
    getLecturesByCourseId,
    removeCourse,
    updateCourse,
    addLectureToCourseById,
    removeLectureFromCourse,

}