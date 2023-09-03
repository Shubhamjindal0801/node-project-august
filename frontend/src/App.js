import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import Signup from './pages/Signup'
import Login from './pages/Login'
import { ToastContainer } from "react-toastify";
import "bootstrap/dist/css/bootstrap.min.css"
import "react-toastify/dist/ReactToastify.css";

function App() {
  const userData = localStorage.getItem('users')
  return (
    <div className="App">
      <ToastContainer />
      <BrowserRouter>
        <Routes>
          <Route>
            {
              userData ?
                <Route path='/' element={<Dashboard />} />
                :
                <Route path='/' element={<Signup />} />
            }
          </Route>
          <Route path='/user/dashboard' element={<Dashboard />} />
          <Route path='/user/signup' element={<Signup />} />
          <Route path='/user/login' element={<Login />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
