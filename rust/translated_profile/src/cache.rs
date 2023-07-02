pub mod cache_service {

    use lazy_static::lazy_static;
    use memcache::Client;
    use std::sync::Mutex;

    use moka::sync::Cache;

    use crate::profile::Hotel;

    const CACHE_URL: &str = "memcache://localhost:11211";
    const DISABLE_CACHE: bool = false;

    lazy_static! {
        // pub static ref CLIENT: Mutex<Option<Client>> = Mutex::new(None);
        pub static ref CLIENT: moka::sync::Cache<String, String> = moka::sync::Cache::new(100);
    }

    pub fn get_client() -> Option<Cache<String, String>> {
        // CLIENT.lock().unwrap().clone()
        std::option::Option::Some(CLIENT.clone()) // moka
    }

    pub fn init_client() -> Client {
        // let client = Client::connect(CACHE_URL).unwrap();
        let client = Client::connect(CACHE_URL).unwrap();
        // CLIENT.lock().unwrap().replace(client.clone());

        return client;
    }

    pub fn get_hotels(hotel_ids: Vec<String>) -> Vec<Hotel> {
        if DISABLE_CACHE {
            return Vec::new();
        }

        let cache_client = get_client().unwrap();

        // create empty vector for returning Hotels
        let mut hotels: Vec<Hotel> = Vec::new();

        // get all hotels from the cache through a loop
        for hotel_id in hotel_ids {
            let hotel = cache_client.get(&hotel_id);

            // if the hotel exists, add it to the vector
            if let Some(hotel) = hotel {
                let hotel: Hotel = serde_json::from_str(&hotel).unwrap();

                // log
                println!("Hotel found in cache: {:?}", hotel.id);

                hotels.push(hotel);
            }
        }

        // extend the hotel_vec with the hotels from the cache
        return hotels;
    }

    pub fn set_hotel(key: String, hotel: Hotel) -> () {
        if DISABLE_CACHE {
            return;
        }

        let cache_client = get_client().unwrap();

        println!("Hotel inserting in cache: {:?}", hotel.id);

        let hotel_string = serde_json::to_string(&hotel).unwrap();

        cache_client.insert(key, hotel_string);
    }
}
