import { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";
import db from "../../../../module/db";

const verify = (req:NextApiRequest, res:NextApiResponse) => {
    if(req.method == "GET"){
        const {token} = req.query;
        if(!token) return res.json({status: "Error", message: "Token not found!"})
        jwt.verify(String(token), process.env.JWT_SECRET as string, (err, decoded)=>{
            if(err) return res.json({status: "Error", message: "Invalid token!"})
            const email = (decoded as { email: string }).email;
            db.query("UPDATE users SET is_verify = 1 WHERE email = ?", [email], (err, result)=>{
                if(err) return res.json({status: "Error", message: "Internal Server Error! (MYSQL)"})
                if(!result) return res.json({status: "Error", message: "Internal Server Error! (MYSQL)"})
                    res.json({status: "Success", decoded:decoded})
            })
        })
    }
}

export default verify;