import { NextApiRequest, NextApiResponse } from "next"
import { errorMessage } from "../../../../module/auth"
import db from "../../../../module/db";

const loginWrong = (req:NextApiRequest, res:NextApiResponse)=>{
    if(req.method == "GET"){
        // console.log(req.query)
        // ทำการรับค่า ID กับ user id จากฝั่งfrontend มา
        const id = req.query.id
        const user_id = req.query.user_id
        // ถ้าไม่มี id ให้ส่ง error กลับไป
        if(!id) {errorMessage(res, "ID not found!"); return}
        // ถ้าไม่มี user id ให้ส่ง error กลับไป
        if(!user_id) {errorMessage(res, "User ID not found!"); return}
        // ถ้ามีทั้ง 2 อย่างให้ทำการค้าหาข้อมูลทั้งหมดใน database ที่ id = id , user_id = user_id
        db.query("SELECT * FROM login_address WHERE id =? AND user_id = ?", [id, user_id], (err, result)=>{
            // ถ้าเกิดข้อผิดพลาดขึ้นให้แสดงผล Error
            if(err) {errorMessage(res, "Internal Server Error! (MYSQL)"); return}
            if(!result) {errorMessage(res, "Internal Server Error"); return}
            // ถ้าพบข้อมูลให้ส่งข้อมูลกลับไปให้ฝั่ง frontrnd นำไปแสดงผลอีกที
            res.json({status: "Success", data:result})
        })
    }
}

export default loginWrong