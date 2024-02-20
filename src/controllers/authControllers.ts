import {Request, Response} from 'express';
import { validationResult } from "express-validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User";

const login=async (req: Request, res: Response) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
      res.status(400).json({ message: error.array() });
      return;
    }
    const { email, password } = req.body;
    try {
      const user = await User.findOne({ email });
      if (!user) {
        res.status(400).json({ message: "Invalid credentials." });
        return;
      }
      const matchPassword = await bcrypt.compare(password, user.password);
      if (!matchPassword) {
        res.status(400).json({ message: "Invalid credentials." });
        return;
      }
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
      console.log('inside login success')
      res.status(200).json({ message: user._id });
    } catch (error) {
      console.log("Something went wrong", error);
      res.status(500).json({ message: "Something went wrong!" });
    }
  }

const logout=(req:Request, res:Response)=>{
  res.cookie("auth_token","",{
    expires:new Date(0)
  });
  res.send();
}

export {login, logout};