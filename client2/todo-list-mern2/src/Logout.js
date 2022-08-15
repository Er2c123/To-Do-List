import axios from 'axios';
import React from 'react';
import { useNavigate } from "react-router-dom";

function Logout() {
    const navigate = useNavigate();

    //once logged out, navigate to login screen
    const navToLogin = () => {
        navigate("/Login");
    }

    //by removing the localStorage that has that specific value, the token is "essentially" removed
    const removeCookie = async (event) => {
        event.preventDefault();
        localStorage.setItem('token', '');
        localStorage.setItem('username', '');
        alert("You're logged out!")
        navToLogin();

    }
    return (
        <div class="logout-container">
            <button onClick={removeCookie} class="logout-bttn">
                Logout
            </button>
        </div>
    )
}
export default Logout;
