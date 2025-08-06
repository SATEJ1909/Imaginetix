import mongoose from "mongoose";
const JWT_SECRET = process.env.JWT_SECRET || "jwtsecret"
const connectDB =  async () =>{

    mongoose.connection.on('connected' , ()=>{
        console.log("Connected to the Database")
    })

    await mongoose.connect(`${process.env.MONGO_URL}/imageGenerator`)
}

export default connectDB ;