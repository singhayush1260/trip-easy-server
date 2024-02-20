import express from "express";
import { param} from "express-validator";
import verifyToken from "../middleware/auth";
import {searchHotels, getAllHotels, getHotelById, createPaymentIntent, confirmBooking} from "../controllers/hotelControllers";

const router = express.Router();

router.get("/search", searchHotels);

router.get("/",getAllHotels);

router.get("/:id",[param("id").notEmpty().withMessage("Hotel Id is required")],getHotelById);

router.post("/:hotelId/bookings/payment-intent",verifyToken,createPaymentIntent);

router.post("/:hotelId/bookings",verifyToken,confirmBooking);

export default router;
