import { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";
import db from "../../../../module/db";
import bcrypt from "bcrypt";
import sendMail from "../../../../module/sendMail";

const validateEmail = (email: string) => {
    return String(email)
        .toLowerCase()
        .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );
}

// ใช้ linear search ตรวจสอบว่า Password ปลอดภัยไหม
const validatePassword = (password: string) => {
    if(password.length < 8) return {status: false, message: "Password must be at least 8 characters long!"}
    const specialChars = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
    let UperCase:number = 0
    let LowerCase:number = 0
    let Number:number = 0
    let SpecialChar:number = 0
    for(let i = 0; i < password.length; i++){
        if(password[i].match(/[A-Z]/)) UperCase++
        if(password[i].match(/[a-z]/)) LowerCase++
        if(password[i].match(/[0-9]/)) Number++
        if(password[i].match(specialChars)) SpecialChar++
    }
    if(UperCase < 1) return {status: false, message: "Password must contain at least 1 uppercase letter!"}
    if(LowerCase < 1) return {status: false, message: "Password must contain at least 1 lowercase letter!"}
    if(Number < 1) return {status: false, message: "Password must contain at least 1 number!"}
    if(SpecialChar < 1) return {status: false, message: "Password must contain at least 1 special character!"}
    return {status: true}
}

const errorMessage = (res:NextApiResponse, message:string)=>{
    res.json({status: "Error", message: message})
}

export default function register(req:NextApiRequest, res:NextApiResponse){
    if(req.method == "POST"){
        const { username, email, password, confirm_password } = req.body;
        if(!username) {errorMessage(res, "Plase Enter your usernamename!"); return}
        if(!email) {errorMessage(res, "Plase Enter your email!"); return}
        if(!validateEmail(email)) {errorMessage(res, "Invalid Email Address!"); return}
        if(!password) {errorMessage(res, "Plase Enter your password!"); return}
        if(!confirm_password) {errorMessage(res, "Plase Enter your confirm password!"); return}
        const passwordValidation = validatePassword(password)
        if (!passwordValidation?.status) {errorMessage(res, String(passwordValidation?.message)); return }
        if(password !== confirm_password) {errorMessage(res, "Password and Confirm Password not match!"); return}
        db.query("SELECT * FROM users WHERE email = ?", [email], (err, result)=>{
            if(err) {errorMessage(res, "Internal Server Error! (MYSQL)"); return}
            if(!result) {errorMessage(res, "Internal Server Error! (MYSQL)"); return}
            // ใช้ Array Dictionary ในการเก็บข้อมูลที่ได้จากการ query
            if(Array.isArray(result) && result.length > 0) {
                errorMessage(res, "Email already exists!")
            }else{
                bcrypt.hash(password, 10, (err, hash)=>{
                    if(err) {errorMessage(res, "Internal Server Error (hashing password Error)!"); return}
                    if(!hash) {errorMessage(res, "Internal Server Error (hash data not found)!"); return}
                    jwt.sign({email: email}, process.env.JWT_SECRET as string, {expiresIn: '1d'}, (err, token)=>{
                        if(err) {errorMessage(res, "Internal Server Error!"); return}
                        if(!token) {errorMessage(res, "Internal Server Error!"); return}
                        db.query("INSERT INTO users (username, email, password) VALUES (?, ?, ?)",
                            [username, email, hash], (err, result)=>{
                                if(err) {errorMessage(res, "Internal Server Error! (MYSQL)"); return}
                                if(!result) {errorMessage(res, "Internal Server Error! (MYSQL)"); return}
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