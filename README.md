# DeathStarBench Hotel Reservation Microservice Translation (TypeScript)

This project aims to provide a TypeScript translation of the Hotel Reservation microservice from the DeathStarBench repository.

## Hotel Reservation Microservice

The Hotel Reservation microservice is responsible for handling hotel reservations in the DeathStarBench system. It interacts with other microservices to manage hotel availability, customer information, and booking details.

## Translation Details

This project provides a TypeScript implementation of the Hotel Reservation microservice. It utilizes the Express framework for building the server and includes the necessary modules and dependencies for its functionality. The translation aims to maintain the logic and functionality of the original microservice while adapting it to a TypeScript environment.

## Prerequisites

- Node.js (v12.4 or later)
- npm (Node Package Manager)
- TypeScript (v4.4 or later)

P.S Some additional dependencies might also be required due to the use of the `mongodb-memory-server` package.

## Getting Started

Follow these steps to set up and run the Hotel Reservation microservice:

1. Install dependencies (`npm install`)
2. Run the project (`npm run dev`)
3. The server will be running on port 3000 by default. You can change this in the `src/index.ts` file or through the `PORT` env variable.

Note: [The mongodb-memory-server runs a disposable instance of mongoDB in memory at each invocation of the test suite.](https://www.npmjs.com/package/mongodb-memory-server)
## Testing
Send a `POST` request to the `/hotels` endpoint with a list of hotel IDs to fetch their profiles. The request body should be in the following format:
```
{
    "HotelIds": ["HotelId1", "HotelId2", ...] # '1', '2', ...
}
````
