import { NextApiRequest, NextApiResponse } from "next"; // นำเข้าประเภทของคำขอและคำตอบจาก Next.js
import { errorMessage } from "../../../../module/auth"; // นำเข้า function สำหรับส่ง error message
import bcrypt from "bcrypt"; // นำเข้า bcrypt สำหรับการตรวจสอบ password
import db from "../../../../module/db"; // นำเข้า db สำหรับเชื่อมต่อฐานข้อมูล
import jwt from "jsonwebtoken"; // นำเข้า jsonwebtoken สำหรับการสร้าง token
import { RowDataPacket } from "mysql2"; // นำเข้า RowDataPacket จาก mysql2 สำหรับการจัดการผลลัพธ์จากฐานข้อมูล

// ฟังก์ชันสำหรับดึงข้อมูลจาก user-agent เพื่อหาข้อมูลระบบ (เช่น OS และเบราว์เซอร์)
const getSystemInfoFromUserAgent = (userAgent: string): string | null => {
    const regex = /\(([^)]+)\)/; // ใช้ Regular Expression เพื่อหาข้อมูลที่อยู่ในวงเล็บ
    const match = userAgent.match(regex); // ใช้ match เพื่อดึงข้อมูลที่ตรงกับ pattern
    if (match) {
        // ถ้ามีข้อมูลใน user-agent ให้แยกข้อมูลที่ต้องการและคืนค่า
        return match[1].split(';').slice(0, 2).join(';').trim();
    } else {
        // ถ้าไม่พบข้อมูลให้คืนค่า null
        return null;
    }
};

// ฟังก์ชันสำหรับจัดการกระบวนการ login
const login = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === "POST") { // ตรวจสอบว่าการร้องขอเป็น POST method หรือไม่
        // ดึงค่า user-agent จาก header ของ request
        const userAgent = req.headers['user-agent'];
        // ดึงข้อมูลระบบจาก user-agent
        const systemInfo = userAgent ? getSystemInfoFromUserAgent(userAgent) : null;
        // ดึง IP address จาก header หรือจาก socket
        const ip_1 = req.headers["x-forwarded-for"] || req.socket.remoteAddress;

        // ตรวจสอบว่า IP address มีค่าหรือไม่
        if (!ip_1) {
            errorMessage(res, 'IP Address not found'); // ถ้าไม่มี IP ให้ส่งข้อความ error
            return;
        }

        // ดึงค่า email และ password จาก body ของ request
        const { email, password } = req.body;

        // ตรวจสอบว่า email หรือ password ไม่มีการส่งมา
        if (!email) {
            errorMessage(res, "Please Enter your email!"); // ถ้าไม่มี email ให้แสดงข้อความ error
            return;
        }

        if (!password) {
            errorMessage(res, "Please Enter your password!"); // ถ้าไม่มี password ให้แสดงข้อความ error
            return;
        }

        // ตรวจสอบข้อมูลผู้ใช้จากฐานข้อมูล
        try {
            const result = await new Promise<RowDataPacket[]>((resolve, reject) => {
                // query ฐานข้อมูลเพื่อตรวจสอบผู้ใช้จาก email
                db.query("SELECT * FROM users WHERE email = ?", [email], (err, result) => {
                    if (err) {
                        reject("Internal Server Error! (MYSQL)"); // ถ้าเกิดข้อผิดพลาดในการ query ให้ reject
                    } else {
                        resolve(result as RowDataPacket[]); // ถ้า query สำเร็จให้ resolve ผลลัพธ์
                    }
                });
            });

            // ถ้าไม่พบข้อมูลผู้ใช้
            if (!Array.isArray(result) || result.length === 0) {
                errorMessage(res, "Email not found!"); // ถ้าไม่พบให้แสดง error
                return;
            }

            const user = result[0] as { id: number, password: string, isVerify: number };

            // ตรวจสอบว่าผู้ใช้ถูกบล็อก IP หรือไม่
            const blockCheckResult = await new Promise<RowDataPacket[]>((resolve, reject) => {
                // query ฐานข้อมูลเพื่อตรวจสอบ IP ที่ถูกบล็อกสำหรับผู้ใช้
                db.query("SELECT ip FROM block WHERE user_id = ?", [user.id], (err, result) => {
                    if (err) {
                        reject("Internal Server Error! (MYSQL)"); // ถ้าเกิดข้อผิดพลาดในการ query ให้ reject
                    } else {
                        resolve(result as RowDataPacket[]); // ถ้า query สำเร็จให้ resolve ผลลัพธ์
                    }
                });
            });

            // ตรวจสอบว่ามี IP ที่ตรงกับ IP ของผู้ใช้หรือไม่
            if (Array.isArray(blockCheckResult) && blockCheckResult.length > 0) {
                const rows = blockCheckResult as RowDataPacket[];
                for (const e of rows) {
                    if (e.ip === ip_1) {
                        errorMessage(res, "Your IP has been blocked. Please contact your administrator."); // ถ้า IP ตรงให้แสดงข้อความ error
                        return;
                    }
                }
            }

            // ตรวจสอบว่าผู้ใช้ยังไม่ได้ยืนยันบัญชีหรือไม่
            if (user.isVerify === 0) {
                errorMessage(res, "Please verify your account"); // ถ้ายังไม่ยืนยันบัญชีให้แสดงข้อความ error
                return;
            }

            // ตรวจสอบความถูกต้องของ password
            bcrypt.compare(password, user.password, async (err, isLogin) => {
                if (err) {
                    errorMessage(res, "Internal Server Error! (Bcrypt)"); // ถ้าเกิดข้อผิดพลาดจาก bcrypt ให้แสดงข้อความ error
                    return;
                }

                if (!isLogin) { // ถ้า password ไม่ตรง
                    try {
                        // ทำการดึงข้อมูลจาก IP API
                        const response = await fetch(`http://ip-api.com/json/${ip_1}`);
                        const data = await response.json();
                        // สร้างตัวแปรข้อมูลที่จะบันทึก
                        const d = {
                            country: data.country || 'Unknown',
                            city: data.city || 'Unknown',
                            zip: data.zip || 'Unknown',
                            lat: data.lat || 'Unknown',
                            lon: data.lon || 'Unknown',
                            timezone: data.timezone || 'Unknown',
                            isp: data.isp || 'Unknown',
                            ip: ip_1,
                            platform: systemInfo || 'Unknown',
                            user_id: user.id,
                        };

                        // ทำการบันทึกข้อมูลลงในฐานข้อมูล
                        db.query("INSERT INTO login_address (country, city, zip, lat, lon, timezone, isp, ip, platform, user_id) VALUES (?,?,?,?,?,?,?,?,?,?)", [
                            d.country, d.city, d.zip, d.lat, d.lon, d.timezone, d.isp, d.ip, d.platform, d.user_id
                        ], (err, result) => {
                            if (err) {
                                errorMessage(res, "Internal Server Error! (MYSQL)"); // ถ้าเกิดข้อผิดพลาดจากฐานข้อมูลให้แสดงข้อความ error
                                return;
                            }

                            errorMessage(res, "Invalid email or password!"); // ถ้า login ไม่สำเร็จให้แสดงข้อความ error
                        });
                    } catch (error) {
                        res.status(500).json({ error }); // ถ้าเกิดข้อผิดพลาดจากการดึงข้อมูล IP API ให้แสดงข้อผิดพลาด
                    }
                    return;
                }

                // ถ้ารหัสผ่านถูกต้อง ให้สร้าง JWT token
                const token = jwt.sign({ email: email, id: user.id }, process.env.JWT_SECRET as string, { expiresIn: '1d' });
                res.json({ status: "Success", message: "Login Success!", token }); // ส่ง token กลับไป
            });

        } catch (error) {
            errorMessage(res, error instanceof Error ? error.message : "Unknown error"); // ถ้าเกิดข้อผิดพลาดในการ query ให้ส่งข้อความ error
        }
    }
};

export default login;
