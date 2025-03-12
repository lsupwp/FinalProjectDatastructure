import { NextApiRequest, NextApiResponse } from "next";
import { errorMessage } from "../../../../module/auth";
import db from "../../../../module/db";

const unblock = (req:NextApiRequest, res:NextApiResponse)=>{
    if(req.method == "POST"){
        const {user_id, ip} = req.body
        if(!user_id || !ip){errorMessage(res, "Not found user or ip"); return}
        db.query("DELETE FROM block WHERE user_id = ? AND ip = ?", [user_id, ip], (err, result)=>{
            if(err){errorMessage(res, "Internal Server Error!"); return}
            if(!result){errorMessage(res, "Not found user or ip"); return}
            res.json({status: "Success", message: "IP unblocked"})
        })
    }
}

export default unblock