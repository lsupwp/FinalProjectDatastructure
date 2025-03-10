import { checkAuth } from "@/utils/checkAuth";
import axios from "axios";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import Link from "next/link";

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
        await axios.get(`/api/auth/loginWrong?id=${id}&user_id=${res.id}`)
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
        <h1 className="text-2xl mb-5"><Link href="/login-dashbord">Error Login Information</Link></h1>
        {data.length > 0 ? 
        <div className="w-98 border-y-2">
            <h1></h1>
            <div className="flex justify-between mb-3">
                <p>country:</p> 
                <p> {data[0].country}</p></div>
            <div className="flex justify-between mb-3">
                <p>city:</p> 
                <p> {data[0].city}</p></div>
            <div className="flex justify-between mb-3">
                <p>zip:</p> 
                <p> {data[0].zip}</p></div>
            <div className="flex justify-between mb-3">
                <p>(lat, lon):</p> 
                <p> {data[0].lat + ", "+ data[0].lon}</p></div>
            <div className="flex justify-between mb-3">
                <p>timezone:</p> 
                <p> {data[0].timezone}</p></div>
            <div className="flex justify-between mb-3">
                <p>isp:</p> 
                <p> {data[0].isp}</p></div>
            <div className="flex justify-between mb-3">
                <p>ip:</p> 
                <p> {data[0].ip}</p></div>
            <div className="flex justify-between mb-3">
                <p>platform:</p> 
                <p> {data[0].platform}</p></div>
            <div className="flex justify-between mb-3">
                <p>date:</p> 
                <p> {data[0].date}</p></div>
        </div>
    : <p>Not have a data</p>}</div>
  );
};

export default LoginWrong;
