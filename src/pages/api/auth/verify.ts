import { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";
import db from "../../../../module/db";

const verify = (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method == "GET") {
        try {
            // ดึงค่า token มาจาก req.query
            const { token } = req.query;
            // ถ้าเกิดว่าไม่มี token ให้ทำการ response error ออกไป
            if (!token) return res.json({ status: "Error", message: "Token not found!" })
            // ทำการตรวจสอบ token ที่ได้มา
            jwt.verify(String(token), process.env.JWT_SECRET as string, (err, decoded) => {
                // ถ้าเกิดข้อผิดพลาดให้ response error กลับไป
                if (err) return res.json({ status: "Error", message: "Invalid token!" })
                // ทำการ get ค่า email มาจาก token นั้น
                const email = (decoded as { email: string }).email;
                // ทำการ update ค่า isVerify ให้เป็น 1 เพื่อที่จะบอกว่า account นี้ผ่านการตรวจสอบ email แล้ว
                db.query("UPDATE users SET isVerify = 1 WHERE email = ?", [email], (err, result) => {
                    // ถ้าเกิดข้อผิดพลาดให้ response error กลับไป
                    if (err) return res.json({ status: "Error", message: "Internal Server Error! (MYSQL)" })
                    // ถ้าเกิดข้อผิดพลาดให้ response error กลับไป
                    if (!result) return res.json({ status: "Error", message: "Internal Server Error! (MYSQL)" })
                    // ทำการส่ง status success ออกไป
                    res.json({ status: "Success"})
                })
            })
        } catch (err) {
            // ถ้าเกิดข้อผิดพลาดให้ response error กลับไป
            console.error(err);
            res.json({ status: "Error", message: "Invalid token!" })
        }
    }
}

export default verify;