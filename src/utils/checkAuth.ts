import axios from "axios";

export const checkAuth = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
        window.location.href = "/login";
        return;
    }

    try {
        const res = await axios.post("/api/auth/authen", {}, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        });

        if (res.data.status === "Error") {
            localStorage.removeItem("token");
            window.location.href = "/login";
            return
        }
        console.log(res.data);
        return res.data;
    } catch (error) {
        console.log("Auth Error:", error);
    }
};
