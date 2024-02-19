import express, { Request, Response } from "express";
import { check, validationResult } from "express-validator";
import { login } from "../controllers/authControllers";
import verifyToken from '../middleware/auth';
const router = express.Router();

router.get("/validate-token",verifyToken,(req:Request, res:Response)=>{
  console.log('inside verify token');
  res.status(200).send({userId:req.userId});
})

router.post(
  "/login",
  [
    check("email", "Email is required.").isEmail(),
    check("password", "Password with 6 or more characters required.").isLength({
      min: 6,
    }),
  ],
  login
);

router.post("/logout",(req:Request, res:Response)=>{
  res.cookie("auth_token","",{
    expires:new Date(0)
  });
  res.send();
});

export default router;
