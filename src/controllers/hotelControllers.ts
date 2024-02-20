import { Request, Response } from "express";
import Hotel from "../models/Hotel";
import { BookingType, HotelSearchResponse } from "../shared-types";
import { validationResult } from "express-validator";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_API_KEY as string);

const searchHotels=async (req: Request, res: Response) => {
    try {
      const query = constructSearchQuery(req.query);
  
      let sortOptions = {};
      switch (req.query.sortOption) {
        case "starRating":
          sortOptions = { starRating: -1 };
          break;
        case "pricePerNightAsc":
          sortOptions = { pricePerNight: 1 };
          break;
        case "pricePerNightDesc":
          sortOptions = { pricePerNight: -1 };
          break;
      }
  
      const pageSize = 5;
      const pageNumber = parseInt(
        req.query.page ? req.query.page?.toString() : "1"
      );
      const skip = (pageNumber - 1) * pageSize; // number of pages to skip
      const hotels = await Hotel.find(query)
        .sort(sortOptions)
        .skip(skip)
        .limit(pageSize);
      const total = await Hotel.countDocuments(query);
      const response: HotelSearchResponse = {
        data: hotels,
        pagination: {
          total,
          page: pageNumber,
          pages: Math.ceil(total / pageSize),
        },
      };
      //console.log("filtered response", response);
      res.json(response);
    } catch (error) {
      console.log("Some error occurred", error);
      res.status(500).json({ message: "Something went wrong" });
    }
  }

  const getAllHotels=async (req: Request, res: Response) => {
    try {
      const hotels = await Hotel.find().sort("-lastUpdated");
      res.json(hotels);
    } catch (error) {
      console.log("error", error);
      res.status(500).json({ message: "Error fetching hotels" });
    }
  }

const getHotelById=async (req: Request, res: Response) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
      return res.status(400).json({ errors: error.array() });
    }
    const id = req.params.id.toString();
    try {
      const hotel = await Hotel.findById(id);
      res.json(hotel);
    } catch (error) {
      res.status(500).json({ message: "Error fetching hotel" });
    }
  }

  const createPaymentIntent=async (req: Request, res: Response) => {
    // console.log('creating payment intent');
     const { numberOfNights } = req.body;
     const hotelId = req.params.hotelId;
     const hotel = await Hotel.findById(hotelId);
     if (!hotel) {
       return res.status(400).json({ message: "Hotel not found." });
     }
     const totalCost = hotel.pricePerNight * numberOfNights;
 
     const paymentIntent = await stripe.paymentIntents.create({
       amount: totalCost*100,
       currency: "INR",
       shipping: {
         name: 'Jenny Rosen',
         address: {
           line1: '510 Townsend St',
           postal_code: '98140',
           city: 'San Francisco',
           state: 'CA',
           country: 'US',
         },
       },
       description:"description",
       metadata: {
         hotelId,
         userId: req.userId,
       },
     });
     if (!paymentIntent.client_secret) {
       return res
         .status(500)
         .json({ message: "Error creating payment intent." });
     }
     const response = {
       paymentIntentId: paymentIntent.id,
       clientSecret: paymentIntent.client_secret?.toString(),
       totalCost,
     };
     res.send(response);
   }

  const confirmBooking= async (req: Request, res: Response) => {
    // console.log('retrieving payment intent');
     try {
       const paymentIntendId = req.body.paymentIntentId;
       const paymentIntent = await stripe.paymentIntents.retrieve(
         paymentIntendId as string
       );
       if (!paymentIntent) {
         return res.status(400).json({ message: "Payment intent not found." });
       }
       if (
         paymentIntent.metadata.hotelId !== req.params.hotelId ||
         paymentIntent.metadata.userId !== req.userId
       ) {
         return res.status(400).json({ message: "Payment intent mismatch." });
       }
       if (paymentIntent.status !== "succeeded") {
         return res
           .status(400)
           .json({
             message: `Payment intent not succeeded. Status: ${paymentIntent.status}`,
           });
       }
       const newBooking: BookingType = {
         ...req.body,
         userId: req.userId,
       };
      // console.log("new bookings:",newBooking);
       const hotel = await Hotel.findByIdAndUpdate(
         { _id: req.params.hotelId },
         {
           $push: { bookings: newBooking },
         }
       );
       //console.log("hotel",hotel);
       if (!hotel) {
         return res.status(400).json({ message: "Hotel not found." });
       }
       await hotel.save();
       res.status(200).send();
     } catch (error) {
       res.status(500).json({ message: "Something went wrong" });
     }
   } 

export {searchHotels, getAllHotels, getHotelById, createPaymentIntent, confirmBooking};

const constructSearchQuery = (queryParams: any) => {
    //console.log("search query params", queryParams);
    let constructedQuery: any = {};
  
    if (queryParams.destination) {
      constructedQuery.$or = [
        { city: new RegExp(queryParams.destination, "i") },
        { country: new RegExp(queryParams.destination, "i") },
      ];
    }
  
    if (queryParams.adultCount) {
      constructedQuery.adultCount = {
        $gte: parseInt(queryParams.adultCount),
      };
    }
  
    if (queryParams.childCount) {
      constructedQuery.childCount = {
        $gte: parseInt(queryParams.childCount),
      };
    }
  
    if (queryParams.facilities) {
      constructedQuery.facilities = {
        $all: Array.isArray(queryParams.facilities)
          ? queryParams.facilities
          : [queryParams.facilities],
      };
    }
  
    if (queryParams.types) {
      constructedQuery.type = {
        $in: Array.isArray(queryParams.types)
          ? queryParams.types
          : [queryParams.types],
      };
    }
  
    if (queryParams.stars) {
      const starRatings = Array.isArray(queryParams.stars)
        ? queryParams.stars.map((star: string) => parseInt(star))
        : parseInt(queryParams.stars);
  
      constructedQuery.starRating = { $in: starRatings };
    }
  
    if (queryParams.maxPrice) {
      constructedQuery.pricePerNight = {
        $lte: parseInt(queryParams.maxPrice).toString(),
      };
    }
   // console.log("constructed query", constructedQuery);
    return constructedQuery;
  };