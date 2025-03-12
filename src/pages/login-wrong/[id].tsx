import { checkAuth } from "@/utils/checkAuth";
import axios from "axios";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import Headers from "@/components/headers";

interface DataWithId {
    id: number;
    country: string;
    city: string;
    zip: string;
    lat: string;
    lon: string;
    timezone: string;
    isp: string;
    ip: string;
    platform: string;
    date: string;
}

const LoginWrong = () => {
    const router = useRouter();

    const [data, setData] = useState<DataWithId[]>([]);

    const id = router.query.id;

    useEffect(() => {
        const handle = async () => {
            if (!id) return;

            const res = await checkAuth();
            await axios
                .get(`/api/auth/loginWrong?id=${id}&user_id=${res.id}`)
                .then((res) => {
                    const fetchData: DataWithId[] = res.data.data || [];
                    setData(fetchData);
                })
                .catch((err) => {
                    console.log(err);
                });
        };

        handle();
    }, [id]);

    return (
        <div className="@container flex flex-col items-center justify-start h-screen w-full">
            <Headers />
            {data.length > 0 ? (
                <>
                    <div className="overflow-x-auto w-5/6 mt-5">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Title</th>
                                    <th>Content</th>
                                    <th>Title</th>
                                    <th>Content</th>
                                    <th>Title</th>
                                    <th>Content</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>Country</td>
                                    <td>{data[0].country}</td>
                                    <td>City</td>
                                    <td>{data[0].city}</td>
                                    <td>Zip</td>
                                    <td>{data[0].zip}</td>
                                </tr>
                                <tr>
                                    <td>Location</td>
                                    <td>
                                        {data[0].lat}, {data[0].lon}
                                    </td>
                                    <td>Timezone</td>
                                    <td>{data[0].timezone}</td>
                                    <td>ISP</td>
                                    <td>{data[0].isp}</td>
                                </tr>
                                <tr>
                                    <td>IP</td>
                                    <td>{data[0].ip}</td>
                                    <td>Platform</td>
                                    <td>{data[0].platform}</td>
                                    <td>Date</td>
                                    <td>{data[0].date}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    
                </>
            ) : (
                <p>Not have a data</p>
            )}
        </div>
    );
};

export default LoginWrong;
