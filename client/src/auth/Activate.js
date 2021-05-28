import React,{useState , useEffect} from 'react'
import Layout from '../core/Layout'
import {ToastContainer, toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import jwt from 'jsonwebtoken';

import axios from 'axios';


const Activate = ({match}) => {
    const [values, setValues] = useState({
        name : "",
        token : "",
        show : true
    });
    const { name , token, show} = values;
    
    useEffect(()=>{
        let token = match.params.token;
        let {name} = jwt.decode(token);
        
        if(token){
            setValues({...values, name, token})
        }
        console.log(token)
    },[])

    
    const clickSubmit = event => {
        // 
        event.preventDefault();
        axios({
            method : 'POST',
            url : `${process.env.REACT_APP_API}/account-activation`,
            data : { token }
        })
        .then(response => {
            console.log('Account Activation', response);
            // cleane up the state
            setValues({...values, name : '', show : false })
            // using toastnotification
            toast.success(response.data.message)
        })
        .catch(error => {
            console.log('Account Activation ERROR', error.response.data.error);
            // using toastnotification
            toast.error(error.response.data.error)
        })
    }

    const activationLink = () => (
        <div className="text-center">
            <h1 className="p-5">hey {name} , Ready to activate your account ?  </h1>
            <button className="btn btn-outline-primary" onClick={clickSubmit}>
                Activate Account
            </button>
        </div>
    )


    return (
        <Layout>
            <div className="col-md-6 offset-md-3">
                <ToastContainer />
                {activationLink()}
            </div>
        </Layout>
    )
}

export default Activate
