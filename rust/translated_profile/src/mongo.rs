pub mod mongo_service {

    use lazy_static::lazy_static;
    use mongodb::{bson::doc, options::ClientOptions, Client};
    use std::sync::Mutex;

    use crate::profile::Hotel;

    // Database constants
    const MONGO_URL: &str = "mongodb://localhost:27017";
    const DB_NAME: &str = "profile-db";
    const COLLECTION_NAME: &str = "hotels";

    lazy_static! {
        static ref CLIENT: Mutex<Option<Client>> = Mutex::new(None);
    }

    pub fn get_client() -> Option<Client> {
        CLIENT.lock().unwrap().clone()
    }

    pub async fn init_client() -> Client {
        let client_options = ClientOptions::parse(MONGO_URL).await.unwrap();
        let client = Client::with_options(client_options).unwrap();
        CLIENT.lock().unwrap().replace(client.clone());

        return client;
    }

    pub fn get_collection(mongo_client: Client) -> mongodb::Collection<Hotel> {
        let db = mongo_client.database(DB_NAME);
        let collection = db.collection::<Hotel>(COLLECTION_NAME);

        return collection;
    }

    pub async fn get_hotels(hotel_ids: Vec<String>) -> Vec<Hotel> {
        let mongo_client = get_client().unwrap();
        let collection = get_collection(mongo_client);

        // create empty vector for returning Hotels
        let mut hotels: Vec<Hotel> = Vec::new();

        //  get all hotels from the database through a loop
        for hotel_id in hotel_ids {
            let filter = doc! { "id": hotel_id };
            let result = collection.find_one(filter, None).await;

            if let Err(e) = result {
                println!("{:?}", e);
                continue;
            }

            //  if the hotel exists, add it to the vector
            if let Ok(Some(hotel)) = result {
                hotels.push(hotel);
            }
        }

        //  return the hotels
        return hotels;
    }
}
