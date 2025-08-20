import { signup , login , userCredit, paymentRazorpay , verifyRazor} from "../controller/user";
import { userAuth } from "../middleware/auth";
import express from 'express'

const userRouter = express.Router();

//@ts-ignore
userRouter.post("/signup" , signup);
//@ts-ignore
userRouter.post("/login" , login);
//@ts-ignore
userRouter.get("/credits" , userAuth , userCredit);
//@ts-ignore
userRouter.post("/razorpay" , userAuth , paymentRazorpay);
//@ts-ignore
userRouter.post("/verifyPayment" , verifyRazor);

export default userRouter