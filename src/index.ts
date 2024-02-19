import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import "dotenv/config";
import { v2 as cloudinary} from 'cloudinary';
import connectDB from './db/connect_db';

// importing routes
import userRoutes from './routes/userRoutes';
import authRoutes from './routes/authRoutes';
import myHotelRoutes from './routes/myHotelRoutes';
import hotelRoutes from './routes/hotelRoutes';

const PORT=process.env.PORT || 4000;

cloudinary.config({
    cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET
});

connectDB(process.env.MONGODB_URI as string);

console.log("process.env.CLIENT_URL,",process.env.CLIENT_URL)
const app=express();
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin:process.env.CLIENT_URL,
    credentials:true
}));


app.use("/api/auth",authRoutes);
app.use("/api/user",userRoutes);
app.use("/api/my-hotels",myHotelRoutes);
app.use("/api/hotels",hotelRoutes);

app.listen(PORT,()=>{
    console.log(`Server started at PORT ${PORT}`);
});