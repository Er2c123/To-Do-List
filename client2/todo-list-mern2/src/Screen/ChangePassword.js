import React, { useEffect, useState } from 'react';
import axios from 'axios';

function ChangePassword() {
    const [password, setPassword] = useState('');
    const [displayComp, setDisplayComp] = useState(false);
    const handleChangePassword = (e) => {
        const value = e.target.value;
        setPassword(value);
    }
    useEffect(() => {
        //this determines whether the display component with the ability to change password should be available
        //if the username is not stored, then the user is not logged in.
        if(!localStorage.getItem('username')){
            setDisplayComp(false);
        } else {
            setDisplayComp(true);
        }
    }, [])


    const registerUser = async (event) => {
        event.preventDefault()
        if (!displayComp) {
            alert('Must be logged in to change password.')
        } else {

            //Send bearer token to backend to authorize
            const copyPassword = password;
            const config = {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            };
            const bodyParameters = {
                newpassword: copyPassword
            };

            const result = await axios.post('http://localhost:9999/api/change-password',
                bodyParameters,
                config
            )

            if (result.data.status == 'ok') {
                alert('Success')
            } else {
                alert(result.data.error)
            }
        }
    }

    return (
        <div>
            {displayComp ?
                (
                    //only display the input box to change password when user is logged in
                    <div class="change-password-form">
                        
                         <form onSubmit={registerUser}>
                            <h3>
                                Change Password:
                            </h3>
                            <input type="password" name="password" placeholder="New Password" value={password} onChange={handleChangePassword} id = "change-password-text-field"/>
                            <input type="submit" value="Submit Form" id = "change-password-submit-bttn" />
                        </form>
                    </div>
                   
                ) 
                :
                (<div class = "change-password-form">
                    Must be logged in to change password.
                </div>)
            }
        </div>
    )
}
export default ChangePassword;