import React, { useEffect } from 'react'
import InputForm from '../components/register/InputForm'

function Signup() {

    useEffect(()=>{
        document.title = 'Signup - Register to Book Store App - Node Project'
    },[])

    return (
        <div>
            <InputForm />
        </div>
    )
}

export default Signup