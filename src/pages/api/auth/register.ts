import { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";
import db from "../../../../module/db";
import bcrypt from "bcrypt";
import sendMail from "../../../../module/sendMail";

import {errorMessage, validateEmail, validatePassword} from "../../../../module/auth";

export default function register(req:NextApiRequest, res:NextApiResponse){
    if(req.method == "POST"){
        // ดึงค่า username, email, password, confirm_password จาก req.body ออก
        const { username, email, password, confirm_password } = req.body;
        // ถ้าไม่มีข้อมูลต่างๆให้ส่ง response error ออกไป
        if(!username) {errorMessage(res, "Plase Enter your usernamename!"); return}
        if(!email) {errorMessage(res, "Plase Enter your email!"); return}
        // ถ้าเกิด email ไม่ตรงกับ format ที่ตั้งไว้จะส่ง responsr error กลับไป
        if(!validateEmail(email)) {errorMessage(res, "Invalid Email Address!"); return}
        if(!password) {errorMessage(res, "Plase Enter your password!"); return}
        if(!confirm_password) {errorMessage(res, "Plase Enter your confirm password!"); return}
        // เช็คว่า password ที่ผู้ใช้กรอกนั้นตรงตามที่กำหนดไว้หรือไม่ ถ้าไม่ให้ response error ออกไป
        const passwordValidation = validatePassword(password)
        if (!passwordValidation?.status) {errorMessage(res, String(passwordValidation?.message)); return }
        // เช็คว่า password ตรงกับ confirm password หรือไม่ถ้าไม่ให้ทำการ response error กลับไป
        if(password !== confirm_password) {errorMessage(res, "Password and Confirm Password not match!"); return}
        // ถ้าทุกอว่า ok ใทำการค้นหาข้อมูลว่ามี email นี้ในระบบหรือไม่
        db.query("SELECT * FROM users WHERE email = ?", [email], async (err, result)=>{
            // ถ้าเกิด error ให้ส่ง response error กลับไป
            if(err) {errorMessage(res, "Internal Server Error! (MYSQL)"); return}
            if(!result) {errorMessage(res, "Internal Server Error! (MYSQL)"); return}
            // ใช้ Array Dictionary ในการเก็บข้อมูลที่ได้จากการ query
            // ถ้าเกิดว่ามี email ในระบบอยู่แล้วให้ทำการ response error กลับไป
            if(Array.isArray(result) && result.length > 0) {
                errorMessage(res, "Email already exists!")
            // ถ้าไม่มีให้ทำการเข้ารหัส password
            }else{
                const salt = await bcrypt.genSalt()
                bcrypt.hash(password, salt, (err, hash)=>{
                    // ถ้าเกิดข้อผิดพลาดขึ้นจะทำการ response error กลับไป
                    if(err) {errorMessage(res, "Internal Server Error (hashing password Error)!"); return}
                    if(!hash) {errorMessage(res, "Internal Server Error (hash data not found)!"); return}
                    // ทำการสร้าง token เพื่อใช้สำหรับ verify email เละส่งไปยัง email ของผู้ใช้
                    jwt.sign({email: email}, process.env.JWT_SECRET as string, {expiresIn: '1d'}, (err, token)=>{
                        // ถ้าเกิดข้อผิดพลาดขึ้นจะทำการ response error กลับไป
                        if(err) {errorMessage(res, "Internal Server Error!"); return}
                        if(!token) {errorMessage(res, "Internal Server Error!"); return}
                        // ทำการเพิ่มข้อมูลลงไปในฐานข้อมูล
                        db.query("INSERT INTO users (username, email, password) VALUES (?, ?, ?)",
                            [username, email, hash], (err, result)=>{
                                // ถ้าเกิดข้อผิดพลาดขึ้นจะทำการ response error กลับไป
                                if(err) {errorMessage(res, "Internal Server Error! (MYSQL)"); return}
                                if(!result) {errorMessage(res, "Internal Server Error! (MYSQL)"); return}
                                // ทำการส่ง email สำหรับให้ผู้ใช้กด verify 
                                sendMail(email, "Verify your account", `Please click this link to verify your account: <a href"${process.env.BASE_URL+'/register/verify/'+token}">Verify</a> <br> This link will expire in 24 hours! <br> or you can copy this link and paste it in your browser: ${process.env.BASE_URL+'/register/verify/'+token}`)
                                res.json({status: "Success", message: "Register Success! Plese check your email to verify your account!"})
                                return
                            }
                        )
                    })
                })
            }
        })
    }
}