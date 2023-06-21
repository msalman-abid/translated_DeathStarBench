import { Collection, MongoClient } from "mongodb";
import { Hotel } from "../proto/profile/Hotel";
import fs from "fs";
import { MongoMemoryServer } from "mongodb-memory-server";

export class MongoDBService {
  private static mongod: MongoMemoryServer;
  public static client: MongoClient;
  public static collection: Collection; // profile collection

  // connect to local mongodb
  public static async connectToLocal() {
    this.mongod = await MongoMemoryServer.create({
      instance: { dbName: "profile-db" },
    });

    this.client = new MongoClient(this.mongod.getUri(), {
      monitorCommands: true,
    });

    await this.client.connect().catch((err) => {throw err.message});
    
    this.collection = this.client.db("profile-db").collection("hotels");

    console.log("Connected to local MongoDB");
  }

  // connect to remote mongodb (DeathStarBench)
  public static async connectToRemote() {
    const URL = 'mongodb://localhost:27017'
    this.client = new MongoClient(URL, {
      monitorCommands: true,
    });
    await this.client.connect().catch((err) => {throw err.message});

    this.collection = this.client.db("profile-db").collection("hotels");

    console.log("Connected to remote MongoDB");

  }

  public static async disconnect() {
    await this.client.close();
    await this.mongod?.stop();
  }

  public static async initializeDB() {
    this.collection.createIndex({ id: 1 }, { unique: true });
    await this.insertProfileData();
  }

  public static async insertProfileData() {
    const existingHotels = await this.collection.countDocuments();
    if (existingHotels > 0) {
      console.log(`${existingHotels} Hotels already exist in DB`);
      return { message: `${existingHotels} Hotels already exist in DB` };
    }

    const data = fs.readFileSync("data/hotels.json", "utf8");
    const hotels: Hotel[] = JSON.parse(data);

    for (let i = 7; i <= 80; i++) {
      const existsInDb = await this.collection.find({ id: i }).toArray();
      if (existsInDb.length > 0) {
        console.log("Hotel already exists in DB:", i);
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

    if (hotels.length === 0) {
      console.log("No hotels to insert");
      return { message: "No hotels to insert" };
    }

    try {
      const insertedHotels = await this.collection.insertMany(hotels);

      console.log("Inserted hotels:", insertedHotels.insertedCount);

      const dataInMongo = await this.collection.find({}).toArray();
      return dataInMongo;
    } catch (error) {
      console.error("Error inserting hotels:", error);
      return { message: "Error inserting hotels" };
    }
  }
}
