import React,{useState} from 'react'
import { Redirect} from 'react-router-dom'; 
import Layout from '../core/Layout'
import {ToastContainer, toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {authenticate, isAuth} from './helpers';
import axios from 'axios';

const Signin = ({history}) => {
    const [values, setValues] = useState({
        email : "mdabutahersaikat@gmail.com",
        password : "saikat1095",
        buttonText : "Submit"
    })

    const { email , password, buttonText} = values;

    const handleChange = (name) =>  (event) => {
        // 
        setValues({...values, [name]: event.target.value})
    }

    const clickSubmit = event => {
        // 
        event.preventDefault();
        setValues({...values, buttonText : 'Submitting'});
        axios({
            method : 'POST',
            url : `${process.env.REACT_APP_API}/signin`,
            data : {email, password}
        })
        .then(response => {
            console.log('Signup Success', response);

            // save the responce (user, token) localstorage/cookie 
            authenticate(response, ()=> {
                // cleane up the state
                setValues({...values, name : '', email : '', password : '', buttonText : 'submitted' })
                // using toastnotification
                // toast.success(`Hery ${response.data.user.name}, Welcome Back!`)
                isAuth() && isAuth().role === 'admin' ? history.push('/admin') : history.push('/private')
            })
        })
        .catch(error => {
            console.log('SIGNIN ERROR', error.response.data);
            // cleane up the state
            setValues({...values, buttonText : 'Submit' })
            // using toastnotification
            toast.error(error.response.data.error)
        })
    }

    const signinForm = () => (
        <form action="">

            <div className="form-group">
                <label htmlFor="" className="text-muted" >Email</label>
                <input onChange={handleChange('email')} value={email} type="email" className="form-control" />
            </div>

            <div className="form-group">
                <label htmlFor="" className="text-muted" >Password</label>
                <input onChange={handleChange('password')} value={password} type="text" className="form-control" />
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
                {isAuth() ? <Redirect to="/"/> : null}
                {JSON.stringify({ email, password})}
                <h1 className="p-5 text-center">Sign In</h1>
                {signinForm()}
            </div>
        </Layout>
    )
}

export default Signin
