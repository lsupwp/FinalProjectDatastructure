import { NextApiRequest, NextApiResponse } from "next";
import db from "../../../../module/db";
import { errorMessage } from "../../../../module/auth";


const block = (req:NextApiRequest, res:NextApiResponse)=>{
    if(req.method == "POST"){
        const {user_id, ip} = req.body
        db.query("SELECT * FROM block WHERE ip = ? AND  user_id = ?", [ip, user_id], (err, result)=>{
            if(err) {errorMessage(res, "Internal Sever Error"); return}
            if(!Array.isArray(result) || !result) {errorMessage(res, "Internal Server Error"); return}
            if(result.length > 0){errorMessage(res, "You have been blocked this IP"); return;}
            db.query("INSERT INTO block (ip, user_id) VALUES (?,?)", [ip, user_id], (err, result)=>{
                if(err) {errorMessage(res, "Internal Sever Error"); return}
                if(!result) {errorMessage(res, "Internal Server Error"); return}
                res.json({status:"Success", message: "IP has blocked now!"})
                return
            })
        })
    }
}

export default block