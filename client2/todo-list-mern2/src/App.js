
import './App.css';
import {Switch, Routes, Link, Route, BrowserRouter} from 'react-router-dom';
import Homepage from './Screen/homepage';
import Registration from './Screen/Registration';
import Login from './Screen/Login';
import Logout from './Screen/Logout';
import ChangePassword from './Screen/ChangePassword';

//creates various routes linking to diff pages
function App () {
  const myStyle = {
    color: "black",
    textDecoration: "none", 
  };

    return(
      
     <BrowserRouter>
      <div class = "routebox-container">
        <Link to="/home" style={myStyle}> Home</Link>
        <Link to="/Registration" style={myStyle} > Registration </Link>
        <Link to="/Login" style={myStyle}> Login </Link>
        <Link to="/ChangePassword" style={myStyle}> Change Password</Link>
        <Link to="/Logout" style={myStyle}> Logout</Link>
      </div>
         <Routes>
          <Route path="/home" element={<Homepage/>}> </Route>
          <Route path="/Registration" element={<Registration/>}> </Route>
          <Route path="/Login" element={<Login/>}> </Route>
          <Route path="/ChangePassword" element={<ChangePassword/>}> </Route>
          <Route path="/Logout" element={<Logout/>}></Route>
        </Routes>
      </BrowserRouter> 

    )
}
export default App;
