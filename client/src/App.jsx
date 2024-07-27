
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
import CourseDescription from './pages/Course/CourseDescription.jsx'
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
          <Route path="/course/description" element={<CourseDescription/>} />
          <Route path="*" element={<NotFound />} />
        </Routes> 
    </>
  )
}

export default App
