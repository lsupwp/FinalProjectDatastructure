'use client'
import axios from "axios"
import { useState } from "react"

const Register = ()=>{
    const [username, setUsername] = useState<string>('')
    const [email, setEmail] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const [confirmPassword, setConfirmPassword] = useState<string>('')
    const [error, setError] = useState<string>('')
    const [success, setSuccess] = useState<string>('')

    const register = ()=>{
        axios.post('/api/auth/register', {
            username: username,
            email: email,
            password: password,
            confirm_password: confirmPassword
        }).then(res=>{
            const data = res.data;
            console.log(res.data)
            if(data.status == "Error"){
                setError(data.message)
                setSuccess('')
                return
            }
            setError('')
            setSuccess(data.message)
        }).catch(err=>{
            console.log(err)
        })
    }

    return(
        <div className="@container flex flex-col items-center justify-center h-screen">
            <div className="flex flex-col items-center min-h-96 w-auto p-10 border-2 border-gray-300 rounded-md">
                <div className="w-full flex items-center mb-5 justify-center">
                    <h2 className="text-3xl">Register</h2>
                </div>
                {success &&<div className="w-full flex items-center mb-5 justify-center bg-green-300">
                    <p className="text-green-800">{success}</p>
                </div>}
                {error &&<div className="w-full flex items-center mb-5 justify-center bg-red-300">
                    <p className="text-red-800">{error}</p>
                </div>}
                <div className="w-full flex items-center mb-5 justify-between">
                    <label htmlFor="username">Username</label>
                    <input type="text" id="username" name="username" className="border-2 border-White-300 ml-10" onChange={(e)=> {setUsername(e.target.value)}}/>
                </div>
                <div className="w-full flex items-center mb-5 justify-between">
                    <label htmlFor="email">Email</label>
                    <input type="email" id="email" name="email" className="border-2 border-White-300 ml-10" onChange={(e)=>{setEmail(e.target.value)}}/>
                </div>
                <div className="w-full flex items-center mb-5 justify-between">
                    <label htmlFor="password">Password</label>
                    <input type="password" id="password" name="password" className="border-2 border-White-300 ml-10" onChange={(e)=>{setPassword(e.target.value)}}/>
                </div>
                <div className="w-full flex items-center mb-5 justify-between">
                    <label htmlFor="conform_password">Conform Password</label>
                    <input type="password" id="conform_password" name="conform_password" className="border-2 border-White-300 ml-10" onChange={(e)=>{setConfirmPassword(e.target.value)}}/>
                </div>
                <div className="w-full flex items-center justify-end mb-5">
                    <button className="border-2 px-5 py-2" onClick={register}>Sign-in</button>
                </div>
                <div className="w-full flex items-center justify-center mb-5">
                    <p>You have an account?</p><a className="ml-2 text-blue-600 dark:text-blue-400" href="/login">Click Here</a>
                </div>
            </div>
        </div>
    )
}

export default Register;