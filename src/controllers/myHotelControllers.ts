import { Request, Response } from "express";
import Hotel from "../models/Hotel";

const getAllMyHotels = async (req: Request, res: Response) => {
  //console.log('inside get my hotels')
  try {
    const hotels = await Hotel.find({ userId: req.userId });
    res.json(hotels);
  } catch (error) {
    res.status(500).json({ message: "Error fetching hotels" });
  }
};

const getMyHotelById = async (req: Request, res: Response) => {
  const id = req.params.id.toString();
  try {
    const hotel = await Hotel.findOne({
      _id: id,
      userId: req.userId,
    });
    res.json(hotel);
  } catch (error) {
    res.status(500).json({ message: "Error fetching hotels" });
  }
};
export { getAllMyHotels, getMyHotelById };
