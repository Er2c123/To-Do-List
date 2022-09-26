import React, { useState } from 'react';
import axios from 'axios';

function Registration() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

   const registerUser = async (event) => {
        event.preventDefault()
        const copyUsername = username;
        const copyPassword = password;

        //calls api to register the user 
        const result = await axios.post('http://localhost:9999/api/register', {
                username: copyUsername,
                password: copyPassword
            })
            if(result.data.status == 'ok'){
                alert("Success");
            } else {
                alert(result.data.error);
            }

        setUsername('');
        setPassword('');
       
    }

    return (
        <div data-testid = "Registration" class = "wrap">
            <form id="reg-form" onSubmit={(event) => { registerUser(event) }} >
                <div class = "form-header">
                    <h3> Registration form </h3>
                    <p> Create an account today!</p>
                </div>
                <div class = "form-group">
                    <input type="text" autocomplete="off" id="username" placeholder="Username" onChange={(e) => { setUsername(e.target.value) }} value = {username}/>
                </div>
                <div class = "form-group">
                    <input type="text" autocomplete="off" id="password" placeholder="Password" onChange={(e) => { setPassword(e.target.value) } } value = {password}/>
                </div>
                <div class = "form-group">
                    <input type="submit" value="Submit Form" />
                </div>
                <div class = "form-footer">
                    <br></br>
                    <br></br>
                </div>
            </form>
        </div>
    );
}
export default Registration;