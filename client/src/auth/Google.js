import React from 'react'
import axios from 'axios';
import GoogleLogin from 'react-google-login';
import {AiOutlineGoogle} from 'react-icons/ai'

const Google = ({informParent = f => f}) =>{
    const responseGoogle = (response) => {
        // 
        console.log(response.tokenId);
        axios({
            method : "POST",
            url : `${process.env.REACT_APP_API}/google-login`,
            data  : {idToken : response.tokenId}
        })
        .then(response=> {
            console.log('Google SignIn Success');
            // inform parent component.

            
            informParent(response);

        })
        .catch(error => {
            console.log('Google signIn Error', error.response);
        })
        
    }

    return(
        <div className="pb-3">
            <GoogleLogin 
                clientId = {`${process.env.REACT_APP_GOOLE_CLIENT_ID}`}
                render={renderProps => (
                    <button onClick={renderProps.onClick} disabled={renderProps.disabled} className="btn btn-danger btn-lg btn-block w-100"><AiOutlineGoogle /> Login With Google</button>
                  )}
                buttonText ="Login"
                onSuccess={responseGoogle}
                onFailure={responseGoogle}
                cookiePolicy={'single_host_origin'}
            />
        </div>
    )
}

export default Google
