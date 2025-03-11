import { NextApiResponse, NextApiRequest } from "next"
import db from "../../../../module/db";
import { errorMessage } from "../../../../module/auth";
import jwt from "jsonwebtoken";
import sendMail from "../../../../module/sendMail";

const getToken = (req: NextApiRequest, res:NextApiResponse)=>{
    if(req.method == "POST"){
        // get email from req.body
        const {email} = req.body
        // ถ้าไม่มี email ให้ response error ออกไป
        if(!email) {errorMessage(res, "Email not found!"); return}
        // ดึงค่า isVerify ออกมาใช้งาน
        db.query("SELECT isVerify FROM users WHERE email = ?", [email], (err, result)=>{
            // ถ้าเกิด Error ให้ response error ออกไป
            if(err){errorMessage(res, "Internal Server Error!"); return}
            if(!result || !Array.isArray(result)) {errorMessage(res, "Internal Server Error!"); return}
            // ถ้าไม่พบข้อมูลให้ response error ออกไป
            if(Array.isArray(result) && result.length <= 0){errorMessage(res, "Not found your account!"); return}
            // ถ้ามีการยืนยัน email แล้วให้ response error ออกไป
            const is_verify = (result[0] as {isVerify:number}).isVerify
            if(is_verify == 1) {errorMessage(res, "You are verified!"); return}
            // สร้าง token ใหม่ที่ใช้ในการยืนยัน email และ response token ออกไป
            jwt.sign({email:email}, process.env.JWT_SECRET as string, {expiresIn:"1d"}, (err, token)=>{
                if(err) {errorMessage(res, "Internal Server Error!"); return}
                if(!result) {errorMessage(res, "Internal Server Error!"); return}
                sendMail(email, "Verify your account", `Please click this link to verify your account: <a href"${process.env.BASE_URL+'/register/verify/'+token}">Verify</a> <br> This link will expire in 24 hours! <br> or you can copy this link and paste it in your browser: ${process.env.BASE_URL+'/register/verify/'+token}`)
                res.json({status: "Success"})
            })
        })
    }
}

export default getToken