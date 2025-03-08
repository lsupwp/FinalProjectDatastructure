import { useRouter } from 'next/router'
import axios from 'axios'
import { useState } from 'react'

export default function VerifyEmail() {
    const router = useRouter()

    const [isVerify, setIsVerify] = useState<boolean>(false)

    axios.get(`/api/auth/verify?token=${router.query.token}`)
    .then(res=>{
        console.log(res.data)
        if(res.data.status == "Error"){
            setIsVerify(false)
            return
        }
        setIsVerify(true)
    })
    .catch(err=>{
        console.log(err)
    })

    return (isVerify ? (<div>Verify success</div>) : (<div>Verify failed</div>))
}