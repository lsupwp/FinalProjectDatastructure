import { NextApiRequest, NextApiResponse } from "next";
import db from "../../../module/db";
import { errorMessage } from "../../../module/auth";

const loginDashbord = (req:NextApiRequest, res:NextApiResponse)=>{
    if(req.method == "POST"){
        const {id} = req.body
        if(!id) {errorMessage(res, "ID not found!"); return}
        db.query("SELECT id, country, platform, date, ip FROM login_address WHERE user_id = ?", [id], (err, result)=>{
            if(err) return res.json({status: "Error", message: "Internal Server Error! (MYSQL)"})
            if(!result) return res.json({status: "Error", message: "Internal Server Error! (MYSQL)"})
            res.json({status: "Success", data:result})
        })
    }
}

export default loginDashbord