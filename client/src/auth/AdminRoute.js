import React,{} from 'react'
import {Route, Redirect} from 'react-router-dom';
import {isAuth} from './helpers';



const AdminRoute = ({component : Component, ...rest}) => {
    return (
        <Route {...rest} render={
            props => isAuth() && isAuth().role === 'admin' ? <Component {...props}></Component> : <Redirect to={{
                pathname : '/signin',
                state : {from : props.location}
            }}></Redirect>
        }>
        </Route>
    )
}

export default AdminRoute
