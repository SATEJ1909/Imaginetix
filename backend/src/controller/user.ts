import userModel from "../models/userModel";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'
import { Request , Response } from "express";
import { AnyExpression } from "mongoose";
const signup = async (req : Request , res : Response)=>{
    try {
        //@ts-ignore
        const {name , email , password} = req.body;
        if(!name || !email || !password){
            //@ts-ignore
         return res.status(400).json({message : "All fields are required"})
        }
        const hashedPassword = await bcrypt.hash(password , 10);
        const userData = {
            name , email , password : hashedPassword
        }
        const newUser = new userModel(userData);
        const user = await newUser.save();
        const token = jwt.sign({id : user._id},
            //@ts-ignore
            process.env.JWT_SECRET
         )
         //@ts-ignore
        return res.status(201).json({success : true , message : "User created successfully" , token , user : {name : user.name}})

    } catch (error) {
        console.log(error);
        //@ts-ignore
        return res.status(500).json({message : "Something went wrong"})
    }
}


const login = async(req : Request , res : Response)=>{
    try {
        const {email , password} = req.body;
        if(!email || !password){
            return res.status(400).json({message : "All fields are required"})
        }
        const user = await userModel.findOne({email});
        if(!user){
            return res.status(400).json({message : "User not found"})
        }
        const hashedPassword = user.password;
        const isValidPassword = await bcrypt.compare(password , hashedPassword);
        if(!isValidPassword){
            return res.status(400).json({message : "Invalid credentials" , success : false})
        }else{
            const token = jwt.sign({id : user._id},
                //@ts-ignore
                process.env.JWT_SECRET
             )
             return res.status(200).json({ success : true ,message : "User logged in successfully" , token , user : {name : user.name}})
        }
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({message : "Something went wrong"})
    }
}

const userCredit = async(req : Request , res : Response)=>{
    try {
    const userId = req.userId ;

    const user = await userModel.findById(userId);
    if(!user){
        return res.status(400).json({message : "User not found"})
    }
    return res.status(200).json({success : true , message : "User found", user : {creditBalance : user.creditBalance , name : user.name}})

    } catch (error : AnyExpression) {
        console.log(error);
        return res.status(500).json({message : error.message});
    }
}

export {signup , login , userCredit};