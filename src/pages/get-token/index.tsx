import axios from "axios"
import { useState } from "react"

const GetToken = ()=>{

    const [email, setEmail] = useState('')
    const [error, setError] = useState('')
    const [success, setSuccess] = useState(false)

    const handleVerify = async ()=>{
        await axios.post("/api/auth/getToken", {email:email})
        .then(res=>{
            console.log(res.data)
            if(res.data.status == "Error"){
                setError(res.data.message)
                setSuccess(false)
                return
            }
            setError('')
            setSuccess(true)
            window.location.href = "/login"
        }).catch(err=>{
            console.log(err)
        })
    }
    return(
        <div className="@container flex flex-col items-center justify-center h-screen">
            <div className="flex flex-col items-center min-h-96 w-auto p-10 border-2 border-gray-300 rounded-md">
                <div className="w-full flex items-center mb-5 justify-center">
                    <h2 className="text-3xl">Verify Email</h2>
                </div>
                {error && <div className="w-full flex items-center mb-5 justify-center bg-red-300 text-red-800">{error}</div> }
            {success && <div className="w-full flex items-center mb-5 justify-center bg-green-300 text-green-800">Email sent successfully, check your inbox</div> }
                <div className="w-full flex items-center mb-5 justify-between">
                    <input type="email" id="email" name="email" className="border-2 border-White-300 w-full" placeholder="Abd@gmail.com" onChange={(e)=>{setEmail(e.target.value)}}/>
                </div>
                <div className="w-full flex items-center justify-center mb-5">
                    <button className="border-2 px-5 py-2 cursor-pointer" onClick={handleVerify}>Send</button>
                </div>
            </div>
        </div>
    )
}

export default GetToken