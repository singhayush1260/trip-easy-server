import express, {Request, Response} from 'express';
import { register } from '../controllers/userControllers';
import { check, validationResult } from "express-validator";
const router=express.Router();

router.post("/register",[ check("firstName", "First Name is required").isString(),
check("lastName", "Last Name is required").isString(),
check("email", "Email is required").isEmail(),
check("password", "Password with 6 or more characters required").isLength({
  min: 6,
}),],register);

export default router;