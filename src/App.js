import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import LoginForm from './Pages/login';
import LandingPage from './Pages/landingPage';
import Sidebar from './Pages/Sidebar';
import Dashboard from './Pages/Dashboard';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


function App() {
  return (
    <div className="flex min-h-screen w-screen flex-col  font-inter">
      <ToastContainer />
        <BrowserRouter>
        <Routes>
          <Route path='/*' element={<LoginForm/>}/>
          <Route path='/landing-page' element={<LandingPage/>}/>
          {/* <Route path='/dashboard' element={<Sidebar/>}/> */}
          <Route path='/dashboard/*' element={<Dashboard />} />
        </Routes>
        </BrowserRouter>
    </div>
  );
}

export default App;
