'use client'
import axios from "axios"
import { useState } from "react"
import Link from "next/link"

const Register = () => {
    const [username, setUsername] = useState<string>('')
    const [email, setEmail] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const [confirmPassword, setConfirmPassword] = useState<string>('')
    const [error, setError] = useState<string>('')
    const [success, setSuccess] = useState<string>('')

    const register = () => {
        axios.post('/api/auth/register', {
            username: username,
            email: email,
            password: password,
            confirm_password: confirmPassword
        }).then(res => {
            const data = res.data;
            console.log(res.data)
            if (data.status == "Error") {
                setError(data.message)
                setSuccess('')
                return
            }
            setError('')
            setSuccess(data.message)
        }).catch(err => {
            console.log(err)
        })
    }

    return (
        <div className="@container flex flex-col items-center justify-center h-screen">
            <div className="flex flex-col items-center h-3/4 w-auto p-10 border-2 border-gray-300 rounded-3xl">
                <div className="w-full flex items-center mb-5 justify-center">
                    <h2 className="text-3xl">Register</h2>
                </div>
                {success && (
                    <div role="alert" className="alert alert-success mb-5 w-full">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6 shrink-0 stroke-current"
                            fill="none"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                        </svg>
                        <span>{success}</span>
                    </div>
                )}
                {error && (
                    <div role="alert" className="alert alert-error w-full mb-5">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6 shrink-0 stroke-current"
                            fill="none"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                        </svg>
                        <span>{error}</span>
                    </div>
                )}
                <div className="w-full flex items-center mb-5 justify-between">
                    <input type="text" id="username" name="username" className="input w-full" placeholder="Username" onChange={(e) => { setUsername(e.target.value) }} />
                </div>
                <div className="w-full flex items-center mb-5 justify-between">
                    <input type="email" id="email" name="email" className="input w-full" placeholder="mail@site.com" onChange={(e) => { setEmail(e.target.value) }} />
                </div>
                <div className="w-full flex items-center mb-5 justify-between">
                    <input type="password" id="password" name="password" className="input w-full" placeholder="Password" onChange={(e) => { setPassword(e.target.value) }} />
                </div>
                <div className="w-full flex items-center mb-5 justify-between">
                    <input type="password" id="conform_password" name="conform_password" className="input w-full" placeholder="Confirm Password" onChange={(e) => { setConfirmPassword(e.target.value) }} />
                </div>
                <div className="w-full flex items-center justify-end mb-5">
                    <button className="btn btn-primary" onClick={register}>Sign-in</button>
                </div>
                <div className="w-full flex items-center justify-start mb-5">
                    <p>You have an account?</p><Link className="ml-2 text-blue-600 dark:text-blue-400" href="/login">Click Here</Link>
                </div>
                <div className="w-full flex items-center justify-start mb-5">
                    <p>You not verify your account?</p>
                    <Link
                        className="ml-2 text-blue-600 dark:text-blue-400"
                        href="/get-token"
                    >
                        Click Here
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default Register;