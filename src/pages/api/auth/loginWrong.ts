import { NextApiRequest, NextApiResponse } from "next"
import { errorMessage } from "../../../../module/auth"
import db from "../../../../module/db";


const loginWrong = (req:NextApiRequest, res:NextApiResponse)=>{
    if(req.method == "GET"){
        console.log(req.query)
        const id = req.query.id
        const user_id = req.query.user_id
        if(!id) {errorMessage(res, "ID not found!"); return}
        db.query("SELECT * FROM login_address WHERE id =? AND user_id = ?", [id, user_id], (err, result)=>{
            if(err) {errorMessage(res, "Internal Server Error! (MYSQL)"); return}
            if(!result) {errorMessage(res, "Internal Server Error"); return}
            res.json({status: "Success", data:result})
        })
    }
}

export default loginWrong