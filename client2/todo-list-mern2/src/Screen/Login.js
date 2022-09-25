import React, { useState } from 'react';
import axios from 'axios';
import {useNavigate} from "react-router-dom";

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');


    const navigate = useNavigate();

    //once person is logged in, take them to the homepage
    const navToLogin = () => {
        navigate("/home");
    }
    const login = async (event) => {
        event.preventDefault()
        const copyUsername = username
        const copyPassword = password;

            const result = await axios.post("http://localhost:9999/api/login", {
                username: copyUsername,
                password: copyPassword
            })
            //must stringify data b/c localStorage requires strings
            if (result.data.status != 'error') {
               localStorage.setItem('token', JSON.stringify(result.data));
                alert('Success')
                localStorage.setItem('username', copyUsername)
                navToLogin();
            } else {
                alert(result.data.error)
            }
        setUsername('');
        setPassword('');
    }

    return (
        <div data-testid = "Login" class = "wrap">
            <form class="login-form" onSubmit={login}>
                <div class="form-header">
                    <h3>Login Form</h3>
                    <p>Login to access your dashboard</p>
                </div>
                <div class="form-group">
                    <input type="text" placeholder = "Username" name="username" value={username} onChange={(e) => setUsername(e.target.value)} class = "form-group-text-field"/>
                </div>

                <div class = "form-group">
                    <input type="text" placeholder = "Password" name="password" value={password} onChange={(e) => setPassword(e.target.value)} class = "form-group-text-field"/>
                </div>
                <div class = "form-group">
                    <input type="submit" value="Submit Form"/>
                </div>
                <div class="form-footer">
                    Don't have an account? Click Registration Up Top
                </div>
            </form>
        </div>
    )
}
export default Login;