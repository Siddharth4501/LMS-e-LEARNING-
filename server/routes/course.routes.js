import {Router} from 'express';
import { getAllCourses,createCourse,getLecturesByCourseId,removeCourse,updateCourse,addLectureToCourseById,removeLectureFromCourse } from '../controllers/course.controller.js';
import { isLoggedIn,authorizedRoles } from '../middlewares/auth.middleware.js';
import upload from '../middlewares/multer.middleware.js';

const router=Router()


router.route('/')//route route ,from here only everything can be done
    .get(getAllCourses)
    .post(isLoggedIn,
        authorizedRoles('ADMIN'),
        upload.single('thumbnail'),
        createCourse
    )
    .delete(isLoggedIn, authorizedRoles('ADMIN'), removeLectureFromCourse);

router.route('/:id')//data passed as params
    .get(isLoggedIn,getLecturesByCourseId)
    .put(isLoggedIn,
        authorizedRoles('ADMIN'),
        updateCourse
    )
    .delete(isLoggedIn,
        authorizedRoles('ADMIN'),
        removeCourse
    )
    .post(isLoggedIn,
        authorizedRoles('ADMIN'),
        upload.single('lecture'),
        addLectureToCourseById,
    );

    export default router;