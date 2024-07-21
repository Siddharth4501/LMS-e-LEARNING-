
import './App.css'
import {Routes,Route} from 'react-router-dom'
import NotFound from './pages/NotFound.jsx'
import Homepage from './pages/Homepage.jsx'
import About from './pages/AboutPage.jsx'
import Signup from './pages/Signup.jsx'
function App() {
  

  return (
    <>
      
       <Routes>
          <Route path="/" element={<Homepage/>} />
          <Route path="/about" element={<About/>} />
          <Route path="/signup" element={<Signup/>} />
          <Route path="*" element={<NotFound />} />
        </Routes> 
    </>
  )
}

export default App
