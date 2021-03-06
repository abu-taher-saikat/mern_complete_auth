import cookie from 'js-cookie';

// Set The Cookie
export const setCookie = (key , value) => {
    if(window !== 'undefined'){
        cookie.set(key, value,{
            expires : 1
        })
    }
}

// Remove from cookie 
export const removeCookie = (key) => {
    if(window !== 'undefined'){
        cookie.remove(key,{
            expires : 1
        })
    }
}

// Get Frm cookie such as stored token.
// will be useful when we need to make request to server with token.
export const getCookie = (key) => {
    if(window !== 'undefined'){
        return cookie.get(key)
    }
}

// Set in localstorage 
export const setLocalStorage = (key , value) => {
    if(window !== 'undefined'){
        localStorage.setItem(key, JSON.stringify(value))
    }
}

// remove from localstorage. 
export const removeLocalStorage = (key) => {
    if(window !== 'undefined'){
        localStorage.removeItem(key)
    }
}


// authenticate user by passing data to cookie and localstorage during signin.
export const authenticate = (response , next)=> {
    console.log(`Authenticate helper on sign in response`, response )
    setCookie('token', response.data.token)
    setLocalStorage('user', response.data.user);
    next();
}

// access user info from localstorage. 
export const isAuth = () => {
    if(window !== 'undefined'){
        const cookieChecked = getCookie('token');
        if(cookieChecked){
            if(localStorage.getItem('user')){
                return JSON.parse(localStorage.getItem('user'));
            }else{
                return false;
            }
        }
    }
}


export const signout = next => {
    removeCookie('token')
    removeLocalStorage('user')
    next();
}