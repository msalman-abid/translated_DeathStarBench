import { Request, Response } from "express";
import { mongoDB } from "../app";
import { Hotel } from "../types/common";

export const getProfiles = async (req: Request, res: Response) => {
    //  TODO: get HotelIds from req.HotelIds
    const { HotelIds } = req.body;
    const collection = mongoDB.db("profile-db").collection("hotels");
    const data = await collection.find({ id: { $in: HotelIds } }).toArray() as unknown as Hotel[];
    return res.status(200).send(data);
    }