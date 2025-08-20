import userModel from "../models/userModel";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'
import { Request, Response } from "express";
import { AnyExpression } from "mongoose";
import razorpay from 'razorpay'
import transactionModel from "../models/transactionModel";

const signup = async (req: Request, res: Response) => {
    try {
        //@ts-ignore
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            //@ts-ignore
            return res.status(400).json({ message: "All fields are required" })
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const userData = {
            name, email, password: hashedPassword
        }
        const newUser = new userModel(userData);
        const user = await newUser.save();
        const token = jwt.sign({ id: user._id },
            //@ts-ignore
            process.env.JWT_SECRET
        )
        //@ts-ignore
        return res.status(201).json({ success: true, message: "User created successfully", token, user: { name: user.name } })

    } catch (error) {
        console.log(error);
        //@ts-ignore
        return res.status(500).json({ message: "Something went wrong" })
    }
}


const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: "All fields are required" })
        }
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "User not found" })
        }
        const hashedPassword = user.password;
        const isValidPassword = await bcrypt.compare(password, hashedPassword);
        if (!isValidPassword) {
            return res.status(400).json({ message: "Invalid credentials", success: false })
        } else {
            const token = jwt.sign({ id: user._id },
                //@ts-ignore
                process.env.JWT_SECRET
            )
            return res.status(200).json({ success: true, message: "User logged in successfully", token, user: { name: user.name } })
        }

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Something went wrong" })
    }
}

const userCredit = async (req: Request, res: Response) => {
    try {
        const userId = req.userId;

        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(400).json({ message: "User not found" })
        }
        return res.status(200).json({ success: true, message: "User found", user: { creditBalance: user.creditBalance, name: user.name } })

    } catch (error: AnyExpression) {
        console.log(error);
        return res.status(500).json({ message: error.message });
    }
}

const razorpayInstance = new razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
})


const paymentRazorpay = async (req: Request, res: Response) => {
    try {
        const { planId } = req.body;
        const userId = req.userId;

        const userData = await userModel.findById(userId);

        if (!planId || !userId) {
            return res.status(400).json({ message: "All fields are required" })
        }

        let credits , plan , amount , date ;

        switch(planId){
            case 'Basic':
                plan = 'Basic';
                credits = 100;
                amount = 10;
                break;

            case 'Advanced':
                plan = 'Advanced';
                credits = 500;
                amount = 50;
                break;

            case 'Business':
                plan = 'Business';
                credits = 5000;
                amount = 250;
                break;

            default:
                return res.status(400).json({  success : false , message: "Invalid plan " })
        }

        date = Date.now();


        const transactionData = {
            userId , plan , amount , credits , date
        }

        const newTransaction = await transactionModel.create(transactionData);

        const options = {
            amount : amount * 100,
            currency : "INR",
            receipt : newTransaction._id
        }

        //@ts-ignore
        await razorpayInstance.orders.create(options , (error , order) =>{
            if(error){
                console.log(error);
                return res.status(500).json({ success : false , message: "Something went wrong" })
            }
            return res.status(200).json({ success : true , message: "Order created successfully" , order });
        });
    }

    catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Something went wrong" })
    }
}


 const verifyRazor = async (req: Request, res: Response)=> {
    try {
        const {razorpay_order_id} = req.body;
        const orderInfo = await razorpayInstance.orders.fetch(razorpay_order_id);

        if(orderInfo.status === 'paid'){
            const transactionData = await transactionModel.findById(orderInfo.receipt);

            if(transactionData.payment){
                return res.status(400).json({  success : false , message: "Payment already done" })
            }

            const userData = await userModel.findById(transactionData.userId);

            const creditBalance = userData.creditBalance + transactionData.credits;

            await userModel.findByIdAndUpdate(userData._id , {creditBalance});

            await transactionModel.findByIdAndUpdate(transactionData._id , {payment : true});

            return res.status(200).json({  success : true , message: "Payment successful" });
        }else{
            return res.status(400).json({  success : false , message: "Payment failed" })
        }
    } catch (error) {
        console.log(error); 
        return res.status(500).json({ message: "Something went wrong" })
    }
}



export { signup, login, userCredit , paymentRazorpay , verifyRazor };