import { mongoDB } from "../src/app";
import fs from "fs";
import { Hotel } from "../src/constants/types";

export const insertProfileData = async () => {
  const collection = mongoDB.db("profile-db").collection("hotels");
  collection.createIndex({ id: 1 }, { unique: true });

  // find id:1 if it exists and count the number of documents

  const result = await collection.findOne({ id: 1 });
  if (result) {
    console.log("Document already exists");
  } else {
    // read file data/hotels.json
    // insert the document into the collection

    const data = fs.readFileSync("data/hotels.json", "utf8");
    const hotels: Hotel[] = JSON.parse(data);

    for (let i = 7; i <= 80; i++) {
      const existingDocs = await collection.find({ id: i }).toArray();

      if (existingDocs.length > 0) {
        console.log("Document already exists");
        continue;
      }

      const hotelId = i;
      const phone = "(415) 284-40" + hotelId;

      const lat = 37.7835 + (Number(i) / 500.0) * 3;
      const lon = -122.41 + (Number(i) / 500.0) * 4;

      const hotel: Hotel = {
        id: String(hotelId),
        name: "St. Regis San Francisco",
        phoneNumber: phone,
        description:
        "St. Regis Museum Tower is a 42-story, 484 ft skyscraper in the South of Market district of San Francisco, California, adjacent to Yerba Buena Gardens, Moscone Center, PacBell Building and the San Francisco Museum of Modern Art.",
        address: {
          streetNumber: "125",
          streetName: "3rd St",
          city: "San Francisco",
          state: "CA",
          country: "USA",
          postalCode: "94103",
          lat: lat,
          lon: lon,
        },
      };

      hotels.push(hotel);
    }

    const insertedHotels = await collection.insertMany(hotels);

    console.log("Inserted hotels:", insertedHotels.insertedCount);

    const dataInMongo = await collection.find({}).toArray();
    return dataInMongo;
  }
};
