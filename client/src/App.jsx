
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
import Checkout from './pages/Payment/Checkout.jsx'
import CheckoutSuccess from './pages/Payment/CheckoutSuccess.jsx'
import CheckoutFail from './pages/Payment/CheckoutFail.jsx'
import DisplayLectures from './pages/Dashboard/DisplayLectures.jsx'
import AddLectures from './pages/Dashboard/AddLecture.jsx'
import AdminDashboard from './pages/Dashboard/AdminDashboard.jsx'
import ChangePassword from './pages/Password/ChangePassword.jsx'
import ForgetPassword from './pages/Password/ForgetPassword.jsx'
import ResetPassword from './pages/Password/ResetPassword.jsx'
function App() {
  

  return (
    <>
      
       <Routes>
          <Route path="/" element={<Homepage/>} />
          
          <Route path="/about" element={<About/>} />
          <Route path="/forgetpassword" element={<ForgetPassword/>} />
          <Route path="/reset-password/:resetToken" element={<ResetPassword />} />
          <Route path="/denied" element={<Denied/>} />
          <Route path="/signup" element={<Signup/>} />
          <Route path="/login" element={<Login/>} />
          <Route path="/contact" element={<Contact/>} />
          <Route path="/courses" element={<CourseList/>} />
          

          <Route element={<RequireAuth allowedRoles={["USER", "ADMIN"]} />}>
            <Route path="/course/description" element={<CourseDescription />} />
            <Route path="/user/profile" element={<Profile/>} />
            <Route path="/user/editprofile" element={<EditProfile/>} />
            <Route path="/changepassword" element={<ChangePassword />} />
            <Route path="/checkout" element={<Checkout/>} />
            <Route path="/checkout/success" element={<CheckoutSuccess/>} />
            <Route path="/checkout/fail" element={<CheckoutFail/>} />
            <Route path="/course/displaylectures" element={<DisplayLectures/>} />
          </Route>

          <Route element={<RequireAuth allowedRoles={["ADMIN"]} />}>
            <Route path="/course/create" element={<CreateCourse />} />
            <Route path="/course/addlecture" element={<AddLectures />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes> 

        
    </>
  )
}

export default App
