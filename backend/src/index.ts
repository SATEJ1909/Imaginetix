import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose'
import  'dotenv/config'
import connectDB from './config';
import userRouter from './routes/user';
import imageRouter from './routes/image';

const PORT = process.env.PORT || 3000 ;

const app = express();

app.use(express.json())
app.use(cors());
app.use("/api/v1/user" , userRouter);
app.use("/api/v1/image" , imageRouter);



 async function main (){
    await connectDB();
    app.listen(PORT , ()=>{
        console.log("server running on PORT : ",PORT)
    })
}

main();
