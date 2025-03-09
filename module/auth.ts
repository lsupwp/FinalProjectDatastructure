import { NextApiResponse } from 'next';

const errorMessage = (res:NextApiResponse, message:string)=>{
    res.json({status: "Error", message: message})
}

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

export {errorMessage, validateEmail, validatePassword};