import { useEffect, useState } from "react";
import { checkAuth } from "@/utils/checkAuth";
import axios from "axios";
import Headers from "@/components/headers";
import Link from "next/link";

// Define the structure of the data from the API response
interface DashboardData {
    id: number;
    country: string;
    platform: string;
    ip: string;
    date: string;
}

interface IpBlock {
    ip: string
}

const LoginDashboard = () => {
    const [data, setData] = useState<DashboardData[]>([]);
    const [ips, setIps] = useState<IpBlock[]>([])
    const [userId, setUserId] = useState("")

    useEffect(() => {
        const authenticateUser = async () => {
            try {
                const res = await checkAuth();
                if (res && res.id) {
                    const response = await axios.post("/api/auth/loginDashbord", { id: res.id });
                    console.log(response.data)
                    // console.log(res)
                    // ดึงข้อมูลจาก API แล้วเก็บไว้ในตัวแปร data ที่เป็น Array
                    const fetchedData: DashboardData[] = response.data?.login_result || [];
                    const fetchIps: IpBlock[] = response.data?.block_result || []
                    setUserId(res.id)
                    setIps(fetchIps)
                    setData(fetchedData);
                }
            } catch (err) {
                console.error("Error fetching dashboard data:", err);
            }
        };
        authenticateUser();
    }, []);

    const handleBlock = (ip: string) => {
        axios.post("/api/ip-management/block", { ip: ip, user_id: userId })
            .then(res => {
                // console.log(res.data)
                if (res.data.status == "Error") {
                    alert(res.data.message)
                    return
                }
                alert(res.data.message)
                window.location.reload()
            })
            .catch(err => {
                console.log(err)
            })
    }

    const handleUnblock = (ip: string) => {
        axios.post("/api/ip-management/unblock", { ip: ip, user_id: userId })
            .then(res => {
                console.log(res.data)
                if (res.data.status == "Error") {
                    alert(res.data.message)
                    return
                }
                alert(res.data.message)
                window.location.reload()
            })
            .catch(err => {
                console.log(err)
            })
    }

    const isInips = (ip: string) => ips.some(item => item.ip === ip);


    return (
        <div className="@container flex flex-col items-center justify-start min-h-screen w-full">
            <Headers />
            {data.length > 0 ?
                <div className="overflow-x-auto rounded-box border border-base-content/5 bg-base-100 w-4/5 mt-5">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>IP</th>
                                <th>Date</th>
                                <th>Country</th>
                                <th>Platfrom</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                data.map((element) => (
                                    <tr key={element.id}>
                                        <th><Link href={`/login-wrong/${element.id}`} className="link link-primary">{data.indexOf(element) + 1}</Link></th>
                                        <th>{element.ip}</th>
                                        <td>{element.date}</td>
                                        <td>{element.country}</td>
                                        <td>{element.platform}</td>
                                        <td>
                                            {isInips(element.ip) ?
                                                <button className="w-25 btn btn-warning" onClick={() => { handleUnblock(element.ip) }}>Unblock</button>
                                                :
                                                <button className="w-25 btn btn-error" onClick={() => { handleBlock(element.ip) }}>Block</button>
                                            }
                                        </td>
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                </div>
                : (<p>No data available</p>)}
        </div>
    );
};

export default LoginDashboard;
