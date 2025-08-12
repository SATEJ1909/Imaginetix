import { Request , Response , NextFunction } from "express";
import jwt from 'jsonwebtoken';
import JWT_SECRET from "../config";


export const userAuth = async (req : Request , res : Response , next : NextFunction)=>{
  
    // const authHeader = req.headers.authorization;
    
    // if (!authHeader || !authHeader.startsWith("Bearer ")) {
    //     return res.status(401).json({ error: "Unauthorized" });
    // }
    
    // const token = authHeader.split(" ")[1];
    
    const token = req.headers.token ;

    if(!token){
        return res.status(401).json({ error: "Unauthorized" });
    }

    try {
        //@ts-ignore
        const decoded = jwt.verify(token, process.env.JWT_SECRET) as { id: string };
        req.userId = decoded.id;
        next();
    } catch (error) {
        return res.status(401).json({ error: "Invalid token" });
    }
}
