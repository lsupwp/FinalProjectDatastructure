import { NextApiRequest, NextApiResponse } from "next";
import { errorMessage } from "../../../../module/auth";
import bcrypt from "bcrypt";
import db from "../../../../module/db";
import jwt from "jsonwebtoken";
import sendMail from "../../../../module/sendMail";

// ดึงข้อมูล ip จาก public api
const getPublicIP = async () => {
    const response = await fetch('https://api64.ipify.org?format=json');
    const data = await response.json();
    return data.ip;
};

// ดึงข้อมูลระบบจาก userAgent
const getSystemInfoFromUserAgent = (userAgent: string): string | null => {
    const regex = /\(([^)]+)\)/;
    const match = userAgent.match(regex);

    if (match) {
        return match[1].split(';').slice(0, 2).join(';').trim();
    } else {
        return null;
    }
};

const login = async (req:NextApiRequest, res: NextApiResponse)=>{
    if(req.method == "POST"){
        // get ค่า ip และ userAgent จาก request header
        const userAgent = req.headers['user-agent'];
        const systemInfo = userAgent ? getSystemInfoFromUserAgent(userAgent) : null;
        const ip = await getPublicIP();
        // ถ้าไม่มี ip ให้ส่ง error กลับไป
        if(!ip) {errorMessage(res, 'IP Address not found'); return}
        // ดึงค่า email และ password จาก body
        const { email, password } = req.body
        // ถ้าไม่มี email หรือ password ให้ส่ง error กลับไป
        if(!email) {errorMessage(res, "Plase Enter your email!"); return}
        if(!password) {errorMessage(res, "Plase Enter your password!"); return}
        // ดึงข้อมูล user จาก email ที่รับมา
        db.query("SELECT * FROM users WHERE email = ?", [email], (err, result)=>{
            // ถ้าเกิด error ให้ส่ง error กลับไป
            if(err) {errorMessage(res, "Internal Server Error! (MYSQL)"); return}
            // ถ้าไม่มีข้อมูลให้ส่ง error กลับไป
            if(!result) {errorMessage(res, "Internal Server Error! (MYSQL)"); return}
            // ถ้ามีข้อมูลให้ทำการเช็ค password ว่าตรงกับที่เราใส่มาหรือไม่
            if(Array.isArray(result) && result.length > 0){
                const user = result[0] as { id:number,  password: string };
                bcrypt.compare(password, user.password, (err, isLogin)=>{
                    // ถ้าเกิด error ให้ส่ง error กลับไป
                    if (err) { errorMessage(res, "Internal Server Error! (Bcrypt)"); return }
                    // ถ้า password ไม่ตรงกับที่เราใส่มาให้ส่ง error กลับไป
                    if (!isLogin) {
                        // ดึงข้อมูล login_address จาก ip ที่รับมา
                        db.query("SELECT * FROM login_address WHERE ip = ? AND platform = ?", [ip, systemInfo], async (err, result)=>{
                            // ถ้าเกิด error ให้ส่ง error กลับไป
                            if(err) {errorMessage(res, "Internal Server Error! (MYSQL)"); return}
                            // ถ้าไม่มีข้อมูลให้ส่ง error กลับไป
                            if(!result) {errorMessage(res, "Internal Server Error! (MYSQL)"); return}
                            // ถ้ามีข้อมูลให้ทำการเพิ่ม count ของ ip นั้นๆ
                            if(Array.isArray(result) && result.length > 0){
                                const resp = result[0] as { count: number }
                                const count = resp.count + 1
                                // อัพเดท count ของ ip นั้นๆ
                                db.query("UPDATE login_address SET count = ? WHERE ip = ?", [count, ip], async (err, result)=>{
                                    // ถ้าเกิด error ให้ส่ง error กลับไป
                                    if(err) {errorMessage(res, "Internal Server Error! (MYSQL)"); return}
                                    // ถ้าไม่มีข้อมูลให้ส่ง error กลับไป
                                    if(!result) {errorMessage(res, "Internal Server Error! (MYSQL)"); return}
                                    //ถ้า count หาร 3 ลงตัวให้ส่ง email ไปหา user
                                    if(count % 3 == 0){
                                        sendMail(email, "Login Alert", `Your account has been logged in from an unknown device. If this was not you, please change your password immediately! ${count}`)
                                    }
                                    errorMessage(res, "Invalid email or password!");
                                })
                            // ถ้าไม่มีข้อมูลให้สร้างข้อมูลใหม่
                            }else{
                                try {
                                    const response = await fetch(`http://ip-api.com/json/${ip}`);
                                    const data = await response.json();
                                    const d = {
                                        country: data.country || 'Unknown',
                                        city: data.city || 'Unknown',
                                        zip: data.zip || 'Unknown',
                                        lat: data.lat || 'Unknown',
                                        lon: data.lon || 'Unknown',
                                        timezone: data.timezone || 'Unknown',
                                        isp: data.isp || 'Unknown',
                                        ip: ip,
                                        platform: systemInfo || 'Unknown',
                                        user_id: user.id
                                    }
                                    db.query("INSERT INTO login_address (country, city, zip, lat, lon, timezone, isp, ip, platform, user_id) VALUES (?,?,?,?,?,?,?,?,?,?)",[
                                        d.country, d.city, d.zip, d.lat, d.lon, d.timezone, d.isp, d.ip, d.platform, d.user_id
                                    ], (err, result)=>{
                                        if(err) {errorMessage(res, "Internal Server Error! (MYSQL)"); return}
                                        if(!result) {errorMessage(res, "Internal Server Error! (MYSQL)"); return}
                                        errorMessage(res, "Invalid email or password!");
                                    })
                                } catch (error) {
                                    res.status(500).json({ error: error });
                                }
                                return
                            }
                        })
                    // ถ้า password ตรงกับที่เราใส่มาให้ส่ง token กลับไป
                    }else{
                        const token = jwt.sign({email: email}, process.env.JWT_SECRET as string)
                        res.json({status: "Success", message: "Login Success!", token})
                    }
                })
            // ถ้าไม่มีข้อมูลให้ส่ง error กลับไป
            } else {
                errorMessage(res, "Invalid email or password!");
            }
        })
    }
}

export default login;