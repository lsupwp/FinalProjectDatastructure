import { NextApiRequest, NextApiResponse } from "next"
import jwt from "jsonwebtoken";
import { errorMessage } from "../../../../module/auth";

const authen = (req:NextApiRequest, res:NextApiResponse)=>{
    if(req.method == "POST"){
        try{
            // ดึงข้อมูล token จาก header ส่วนของ request ที่ส่งมาจาก client
            const token = req.headers.authorization ? req.headers.authorization.split(" ")[1] : null;
            // ถ้าเกิดว่า token เป็นค่า null ให้ทำการ response error ออกไป
            if(!token) {errorMessage(res, "Unauthorized!"); return}
            // ทำการตรวจสอบค่าที่ส่งมาจาก header ว่า token นั้นถูกต้องหรือไม่ถ้าไม่แล้วเก็บในตัวแปร decoded
            const decoded = jwt.verify(token, process.env.JWT_SECRET as string)
            // ถ้าเกิดว่าค่าที่ส่งออกมาไม่ถูกต้องให้ทำการ response error ออกไป
            if(!decoded) {errorMessage(res, "Unauthorized!"); return}
            // ถ้าถูกต้องให้ส่งข้อมูลที่ได้จากการตรวจสอบค่าที่ส่งมาจาก header ออกไป
            const email = (decoded as { email: string }).email;
            const id = (decoded as { id: string }).id;
            // console.log(decoded)
            res.json({status: "Success", message: "Authorized!", email:email,  id: id})
        }catch(err){
            console.log(err)
            errorMessage(res, "Unauthorized!");
        }
    }
}

export default authen