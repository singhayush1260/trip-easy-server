import express, { Request, Response } from "express";
import { check } from "express-validator";
import { login, logout } from "../controllers/authControllers";
import verifyToken from "../middleware/auth";
const router = express.Router();

router.get("/validate-token", verifyToken, (req: Request, res: Response) => {
  res.status(200).send({ userId: req.userId });
});

router.post("/login",
  [
    check("email", "Email is required.").isEmail(),
    check("password", "Password with 6 or more characters required.").isLength({
      min: 6,
    }),
  ],
  login
);

router.post("/logout", logout);

export default router;
