import { Request, Response } from "express";
import User from "../models/User";
import jwt from "jsonwebtoken";
import { validationResult } from "express-validator";

const register = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log("inside error");
    res.status(400).json({ message: errors.array() });
    return;
  }
  try {
    let user = await User.findOne({ email: req.body.email });
    if (user) {
      res.status(400).json({ message: "User already exists." });
      return;
    }
    user = new User(req.body);
    await user.save();

    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET_KEY as string,
      { expiresIn: "1d" }
    );

    res.cookie("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 86400000,
    });

    res.status(200).send({message:"User registered OK"});
    return;
  } catch (error) {
    console.log("Something went wrong", error);
    res.status(500).json({ message: "Something went wrong!" });
  }
};

const currentUser=async(req:Request,res:Response)=>{
  const userId=req.userId;
  try{
    const user=await User.findById(userId).select("-password");
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    res.json(user);
  }
  catch(error){
    res.status(500).json({message:"Something went wrong"})
  }
}
export { register, currentUser };
