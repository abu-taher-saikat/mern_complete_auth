import React,{useState} from 'react'
import Layout from '../core/Layout'
import {ToastContainer, toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {isAuth} from './helpers';
import  {Link, Redirect} from 'react-router-dom';
 
import axios from 'axios';



const Signup = () => {
    const [values, setValues] = useState({
        name : "Abu Taher Saikat",
        email : "mdabutahersaikat@gmail.com",
        password : "saikat1095",
        buttonText : "Submit"
    })

    const {name , email , password, buttonText} = values;

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
            url : `${process.env.REACT_APP_API}/signup`,
            data : {name, email, password}
        })
        .then(response => {
            console.log('Signup Success', response);
            // cleane up the state
            setValues({...values, name : '', email : '', password : '', buttonText : 'submitted' })
            // using toastnotification
            toast.success(response.data.message)
        })
        .catch(error => {
            console.log('SIGNUP ERROR', error.response.data);
            // cleane up the state
            setValues({...values, buttonText : 'Submit' })
            // using toastnotification
            toast.error(error.response.data.error)
        })
    }

    const signupForm = () => (
        <form action="">
            <div className="form-group">
                <label htmlFor="" className="text-muted" >Name</label>
                <input onChange={handleChange('name')} value={name} type="text" className="form-control" />
            </div>

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
                {isAuth() ? <Redirect to="/" /> : null}
                <h1 className="p-5 text-center">Sign up</h1>
                {signupForm()}
            </div>
        </Layout>
    )
}

export default Signup
