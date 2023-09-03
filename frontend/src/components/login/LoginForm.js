import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import React, { useEffect, useState } from 'react'
// import loginUser from '../../actions/UserLoginAction'
import Axios from 'axios'
import { toast } from 'react-toastify'
import './loginForm.css'

const LoginUser = () => {

    const [userDetails, setUserDetails] = useState({
        loginId: '',
        password: ''
    })

    useEffect(() => {
        if (localStorage.getItem("users")) {
            window.location.href = '/user/dashboard'
        }
    }, [])

    const handleSubmit = async (e) => {
        e.preventDefault()
        await Axios.post('https://book-app-backend-um3b.onrender.com/user/login', userDetails)
            .then((res) => {
                toast.success(res.data.message)
                localStorage.setItem('users', JSON.stringify(res.data.data))
                if (res.data.status === 200) {
                    setTimeout(() => {
                        window.location.href = "/user/dashboard";
                    }, 2000)
                }
            }).catch((err) => {
                toast.error(err.response.data.message)
            })
    }

    const handleSignUp = () => {
        window.location.href = '/user/signup'
    }

    return (
        <Form className='signup-form' onSubmit={handleSubmit}>
            <h2 className='mb-5'>Login into your Book App</h2>
            <Form.Group className='mb-3 col-form-label' controlId='name'>
                <Form.Label>Login through email</Form.Label>
                <Form.Control
                    type='email'
                    className='login-input'
                    required
                    placeholder='abc@example'
                    value={userDetails.loginId}
                    onChange={(e) => { setUserDetails({ ...userDetails, loginId: e.target.value }) }}
                />
            </Form.Group>
            <Form.Group className='mb-3 col-form-label' controlId='password'>
                <Form.Label>Password</Form.Label>
                <Form.Control
                    type='password'
                    className='login-input'
                    required
                    placeholder='******'
                    value={userDetails.password}
                    onChange={(e) => { setUserDetails({ ...userDetails, password: e.target.value }) }}
                />
            </Form.Group>
            <Button className='btn btn-primary' type='submit'>Login</Button>
            <div className='mt-3'>
                <p className='mb-1'>Don't have an account?</p>
                <Button className='btn btn-info' onClick={handleSignUp}>Sign Up</Button>
            </div>
        </Form>
    )
}

export default LoginUser