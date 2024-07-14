
import './App.css'
import {Routes,Route} from 'react-router-dom'
import NotFound from './pages/NotFound.jsx'
import Homepage from './pages/Homepage.jsx'
function App() {
  

  return (
    <>
      
       <Routes>
          <Route path="/" element={<Homepage/>} />
          <Route path="*" element={<NotFound />} />
        </Routes> 
    </>
  )
}

export default App
