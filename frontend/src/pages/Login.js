import React, { useEffect } from 'react'
import LoginUser from '../components/login/LoginForm'

function Login() {

    useEffect(()=>{
        document.title = 'Login into your book app - Node Project'
    },[])

    return (
        <LoginUser />
    )
}

export default Login
