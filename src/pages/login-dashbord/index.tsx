import { useEffect, useState } from "react";
import { checkAuth } from "@/utils/checkAuth";
import axios from "axios";
import Link from "next/link";

// Define the structure of the data from the API response
interface DashboardData {
    id: number;
    country: string;
    platform: string;
    ip: string;
    date: string;
}

const LoginDashboard = () => {
    const [data, setData] = useState<DashboardData[]>([]);

    useEffect(() => {
        const authenticateUser = async () => {
            try {
                const res = await checkAuth();
                if (res && res.id) {
                    const response = await axios.post("/api/auth/loginDashbord", { id: res.id });
                    // console.log(response)
                    // ดึงข้อมูลจาก API แล้วเก็บไว้ในตัวแปร data ที่เป็น Array
                    const fetchedData: DashboardData[] = response.data?.data || [];
                    setData(fetchedData);
                }
            } catch (err) {
                console.error("Error fetching dashboard data:", err);
            }
        };
        authenticateUser();
    }, []);


    return (
        <div className="@container flex flex-col items-center justify-start h-screen w-full">
            <h1 className="text-3xl my-5"><Link href="/">Login Dashboard</Link></h1>
            {data.length > 0 ? (
                data.map((element) => (
                    <div key={element.id} className="flex flex-col w-full">
                        <Link href={`/login-wrong/${element.id}`} className="flex flex-row justify-center items-center border-b-2 w-full">
                            <p className="m-2">{element.ip}</p>
                            <p className="m-2">{element.date}</p>
                            <p className="m-2">{element.country}</p>
                            <p className="m-2">{element.platform}</p>
                        </Link>
                    </div>
                ))
            ) : (
                <p>No data available</p> // Show a message if no data
            )}
        </div>
    );
};

export default LoginDashboard;
