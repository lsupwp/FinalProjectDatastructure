import { NextApiRequest, NextApiResponse } from "next"
import jwt from "jsonwebtoken";
import { errorMessage } from "../../../../module/auth";

const authen = (req:NextApiRequest, res:NextApiResponse)=>{
    if(req.method == "POST"){
        try{
            const token = req.headers.authorization ? req.headers.authorization.split(" ")[1] : null;
            if(!token) {errorMessage(res, "Unauthorized!"); return}

            const decoded = jwt.verify(token, process.env.JWT_SECRET as string)
            if(!decoded) {errorMessage(res, "Unauthorized!"); return}
            const email = (decoded as { email: string }).email;
            const id = (decoded as { id: string }).id;
            console.log(decoded)
            res.json({status: "Success", message: "Authorized!", email:email,  id: id})
        }catch(err){
            console.log(err)
            errorMessage(res, "Unauthorized!");
        }
    }
}

export default authen