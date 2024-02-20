import { Request, Response } from "express";
import Hotel from "../models/Hotel";
import { HotelType } from "../shared-types";
const getMyBookings=async (req: Request, res: Response) => {
    //console.log("inside my bookings routes")
  try {
    const hotels = await Hotel.find({
      bookings: { $elemMatch: { userId: req.userId } },
    });
     //console.log("hotels",hotels)
    const results = hotels.map((hotel) => {
      const userBookings = hotel.bookings.filter(
        (booking) => booking.userId === req.userId
      );

      const hotelWithUserBookings: HotelType = {
        ...hotel.toObject(),
        bookings: userBookings,
      };
      //console.log("hotelWithUserBookings",hotelWithUserBookings);
      return hotelWithUserBookings;
    });

    res.status(200).send(results);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Unable to fetch bookings" });
  }
}
export {getMyBookings};