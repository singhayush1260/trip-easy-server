import mongoose from "mongoose";

const connectDB= async (MONGODB_URI:string)=>{
mongoose.connect(MONGODB_URI).then(()=>{
    console.log('Connected to MongoDB database:'+MONGODB_URI);
})
}
export default connectDB;