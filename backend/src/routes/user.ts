import { signup , login } from "../controller/user";
import express from 'express'

const userRouter = express.Router();

//@ts-ignore
userRouter.post("/signup" , signup);
//@ts-ignore
userRouter.post("/login" , login);

export default userRouter