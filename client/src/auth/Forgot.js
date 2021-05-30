import React,{useState} from 'react'
import Layout from '../core/Layout'
import {ToastContainer, toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';

const Forgot = ({history}) => {
    const [values, setValues] = useState({
        email : "",
        buttonText : "Request Password Reset Link"
    })

    const { email , buttonText} = values;

    const handleChange = (name) =>  (event) => {
        // 
        setValues({...values, [name]: event.target.value})
    }

    const clickSubmit = event => {
        // 
        event.preventDefault();
        setValues({...values, buttonText : 'Submitting'});
        console.log(`request sent`)
        axios({
            method : 'PUT',
            url : `${process.env.REACT_APP_API}/forgot-password`,
            data : {email}
        })
        .then(response => {
            console.log('Forgot Password Success', response);
            toast.success(response.data.message)
            setValues({...values, buttonText : "Requested"})
        })
        .catch(error => {
            console.log('Forgot password error', error.response.data);
            // cleane up the state
            setValues({...values, buttonText : 'Submit' })
            // using toastnotification
            toast.error(error.response.data.error)
        })
    }

    const passwordForgotForm = () => (
        <form action="">

            <div className="form-group">
                <label htmlFor="" className="text-muted" >Email</label>
                <input onChange={handleChange('email')} value={email} type="email" className="form-control" />
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
                <h1 className="p-5 text-center">Forgot Password</h1>
                {passwordForgotForm()}
            </div>
        </Layout>
    )
}

export default Forgot
