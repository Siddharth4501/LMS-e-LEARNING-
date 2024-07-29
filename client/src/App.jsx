
import './App.css'
import {Routes,Route} from 'react-router-dom'
import NotFound from './pages/NotFound.jsx'
import Homepage from './pages/Homepage.jsx'
import About from './pages/AboutPage.jsx'
import Signup from './pages/Signup.jsx'
import Login from './pages/Login.jsx'
import Contact from './pages/Contact.jsx'
import CourseList from './pages/Course/CourseList.jsx'
import Denied from './pages/Denied.jsx'
import RequireAuth from './components/Auth/RequireAuth.jsx'
import CourseDescription from './pages/Course/CourseDescription.jsx'
import CreateCourse from './pages/Course/CreateCourse.jsx'
import Profile from './pages/User/Profile.jsx'
import EditProfile from './pages/User/EditProfile.jsx'
function App() {
  

  return (
    <>
      
       <Routes>
          <Route path="/" element={<Homepage/>} />
          <Route path="/about" element={<About/>} />
          
          <Route path="/denied" element={<Denied/>} />
          <Route path="/signup" element={<Signup/>} />
          <Route path="/login" element={<Login/>} />
          <Route path="/contact" element={<Contact/>} />
          <Route path="/courses" element={<CourseList/>} />
          <Route path="/course/create" element={<CreateCourse />} />
          <Route element={<RequireAuth allowedRoles={["USER", "ADMIN"]} />}>
            <Route path="/course/description" element={<CourseDescription />} />
            <Route path="/user/profile" element={<Profile/>} />
            <Route path="/user/editprofile" element={<EditProfile/>} />
          </Route>

          {/* <Route element={<RequireAuth allowedRoles={["ADMIN"]} />}>
            <Route path="/course/createcourse" element={<CreateCourse />} />
          </Route> */}
          <Route path="*" element={<NotFound />} />
        </Routes> 

        
    </>
  )
}

export default App
