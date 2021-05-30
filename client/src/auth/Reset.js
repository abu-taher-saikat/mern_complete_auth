import React,{useState, useEffect} from 'react'
import jwt from 'jsonwebtoken';
import Layout from '../core/Layout'
import {ToastContainer, toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';

const Reset = ({match}) => {
    const [values, setValues] = useState({
        name : "",
        token : "",
        newPassword : "",
        buttonText : "Reset Password "
    })

    useEffect(()=>{
        let token = match.params.token;
        let {name} = jwt.decode(token);
        if(token){
            setValues({...values, name, token})
        }
    },[])

    const { name , token , newPassword, buttonText} = values;

    const handleChange = (event) => {
        setValues({...values, newPassword : event.target.value})
    }

    const clickSubmit = event => {
        // 
        event.preventDefault();
        setValues({...values, buttonText : 'Submitting'});
        console.log(`request sent`)
        axios({
            method : 'PUT',
            url : `${process.env.REACT_APP_API}/reset-password`,
            data : {newPassword, resetPasswordLink : token}
        })
        .then(response => {
            console.log('Reset Password Success', response);
            toast.success(response.data.message)
            setValues({...values, buttonText : "Done"})
        })
        .catch(error => {
            console.log('Reset password error', error.response.data);
            // cleane up the state
            setValues({...values, buttonText : 'Reset Password.' })
            // using toastnotification
            toast.error(error.response.data.error)
        })
    }

    const passwordResetForm = () => (
        <form action="">

            <div className="form-group">
                <label htmlFor="" className="text-muted" >set password</label>
                <input onChange={handleChange} value={newPassword} type="password" className="form-control" placeholder="Type new password." required />
            </div>

            <div className="form-group">
                <button className="btn btn-primary mt-3" onClick={clickSubmit}>{buttonText}</button>
            </div>
        </form>
    )


    return (
        <Layout>
            <div className="col-md-6 offset-md-3">
                <ToastContainer></ToastContainer>
                <h1 className="p-5 text-center">hey {name}, Type your new password</h1>
                {passwordResetForm()}
            </div>
        </Layout>
    )
}

export default Reset
