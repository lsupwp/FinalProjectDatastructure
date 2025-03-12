import axios from "axios"
import { useState } from "react"
import Link from "next/link"

const GetToken = () => {

    const [email, setEmail] = useState('')
    const [error, setError] = useState('')
    const [success, setSuccess] = useState(false)

    const handleVerify = async () => {
        await axios.post("/api/auth/getToken", { email: email })
            .then(res => {
                console.log(res.data)
                if (res.data.status == "Error") {
                    setError(res.data.message)
                    setSuccess(false)
                    return
                }
                setError('')
                setSuccess(true)
                window.location.href = "/login"
            }).catch(err => {
                console.log(err)
            })
    }
    return (
        <div className="@container flex flex-col items-center justify-center h-screen">
            <div className="flex flex-col items-center h-3/4 w-auto p-10 border-2 border-gray-300 rounded-3xl">
                <div className="w-full flex items-center mb-5 justify-center">
                    <h2 className="text-3xl">Verify Email</h2>
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
                        <span>Email sent successfully, check your inbox</span>
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
                    <input type="email" id="email" name="email" className="input" placeholder="mail@site.com" onChange={(e) => { setEmail(e.target.value) }} />
                </div>
                <div className="w-full flex items-center justify-center mb-5">
                    <button className="btn btn-primary" onClick={handleVerify}>Send</button>
                </div>
                <div className="w-full flex items-center justify-start mb-5">
                    <p>Back to login page</p><Link className="ml-2 text-blue-600 dark:text-blue-400" href="/login">Click Here</Link>
                </div>
            </div>
        </div>
    )
}

export default GetToken