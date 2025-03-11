import { NextApiRequest, NextApiResponse } from "next";
import db from "../../../../module/db";
import { errorMessage } from "../../../../module/auth";

const loginDashbord = (req:NextApiRequest, res:NextApiResponse)=>{
    if(req.method == "POST"){
        // ทำการรับค่า user id มาจากฝั่ง frontend
        const {id} = req.body
        // ตรวจสอบว่า user id มีค่าให้หรือไม่ ถ้าไม่มีทำการ response error ออกไป
        if(!id) {errorMessage(res, "ID not found!"); return}
        // ถ้ามีทำการดึงข้อมูลจากฐานข้อมูลมาเก็บไว้เพื่อส่งให้ฝั่ง frontend นำไปแสดงผลอีกที
        db.query("SELECT id, country, platform, date, ip FROM login_address WHERE user_id = ?", [id], (err, result)=>{
            // ถ้าเกิดดึงข้อมูลไม่ได้ให้ส่ง response error กับไป
            if(err) return res.json({status: "Error", message: "Internal Server Error! (MYSQL)"})
            if(!result) return res.json({status: "Error", message: "Internal Server Error! (MYSQL)"})
            // ถ้าดึงได้ให้ทำการส่งข้อมูลที่ดึงได้กลับไป
            res.json({status: "Success", data:result})
        })
    }
}

export default loginDashbord