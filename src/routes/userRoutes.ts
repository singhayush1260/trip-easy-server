import express from 'express';
import { register, currentUser } from '../controllers/userControllers';
import { check} from "express-validator";
import verifyToken from '../middleware/auth';

const router=express.Router();

router.get("/me",verifyToken,currentUser);

router.post("/register",[ check("firstName", "First Name is required").isString(),
check("lastName", "Last Name is required").isString(),
check("email", "Email is required").isEmail(),
check("password", "Password with 6 or more characters required").isLength({
  min: 6,
}),],register);

export default router;