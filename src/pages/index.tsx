import { useEffect } from "react";
import { checkAuth } from "@/utils/checkAuth";
import Link from "next/link";

export default function Home() {
    useEffect(() => {
        checkAuth()
    }, []);

    const logout = ()=>{
        localStorage.removeItem("token");
        window.location.href = "/login";
    }

    return (
        <div className="@container flex flex-col items-center justify-start h-screen w-full">
            <h1 className="text-3xl my-5">Hello My DSA Project</h1>
            <button onClick={logout} className="border-2 px-5 bg-green-500 text-black hover:bg-green-700 cursor-pointer mb-5">Logout</button>
            <Link href={`/login-dashbord`} className="text-3xl text-blue-500">Login Dashbord</Link>
        </div>
    )
}
