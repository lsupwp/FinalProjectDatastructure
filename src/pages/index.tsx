import { useEffect } from "react";
import axios from "axios";

export default function Home() {
    useEffect(() => {
        const token = localStorage.getItem("token");

        axios.post("/api/auth/authen", {}, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        }).then(res => {
            if(res.data.status == "Error"){
                localStorage.removeItem("token");
                window.location.href = "/login";
                return;
            }
        }).catch(err => {
            console.log(err);
        });
    }, []);

    const logout = ()=>{
        localStorage.removeItem("token");
        window.location.href = "/login";
    }

    return (
        <div>
            <button onClick={logout}>Logout</button>
        </div>
    )
}
