import { signup , login , userCredit} from "../controller/user";
import { userAuth } from "../middleware/auth";
import express from 'express'

const userRouter = express.Router();

//@ts-ignore
userRouter.post("/signup" , signup);
//@ts-ignore
userRouter.post("/login" , login);
//@ts-ignore
userRouter.get("/credits" , userAuth , userCredit)

export default userRouter