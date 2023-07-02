#[derive(Debug)]
struct ProfileService;

pub mod profile {
    tonic::include_proto!("profile");
}

use std::collections::HashSet;

use profile::profile_server::{Profile, ProfileServer};
use tonic::transport::Server;
use tonic::{Response, Status};

use cache::cache_service;
use mongo::mongo_service;

use tokio::task;

mod cache;
mod mongo;

#[tonic::async_trait]
impl Profile for ProfileService {
    async fn get_profiles(
        &self,
        request: tonic::Request<profile::Request>,
    ) -> Result<tonic::Response<profile::Result>, Status> {
        println!("Got a request: {:?}", request);

        // access the hotelIds from the request
        let hotel_ids = request.into_inner().hotel_ids;

        // eliminate duplicates by making a set and then converting back to a vector
        let hotel_ids_set: HashSet<String> = hotel_ids.into_iter().collect();
        let hotel_ids: Vec<String> = hotel_ids_set.into_iter().collect();

        // create empty vector for returning Hotels
        let mut hotels: Vec<profile::Hotel> = Vec::new();

        // get all possible hotels from the cache
        hotels.extend(cache_service::get_hotels(hotel_ids.clone()));

        // if all hotels were found in the cache, return them
        if hotels.len() == hotel_ids.len() {
            println!("All {:?} hotels found in cache", hotels.len());

            let reply: profile::Result = profile::Result { hotels: hotels };
            return Ok(Response::new(reply));
        }

        // if not all hotels were found in the cache, get them from the database
        let hotel_ids: Vec<String> = hotel_ids
            .into_iter()
            .filter(|hotel_id| !hotels.iter().any(|hotel| hotel.id == *hotel_id))
            .collect();

        let hotels_from_db = mongo_service::get_hotels(hotel_ids).await;

        // add all hotels from the database to the cache
        for hotel in hotels_from_db.clone() {
            let hotel_id = hotel.id.clone();

            hotels.push(hotel.clone().into());

            task::spawn(async move {
                cache_service::set_hotel(hotel_id, hotel);
            });
        }

        let reply: profile::Result = profile::Result { hotels: hotels };

        Ok(Response::new(reply))
    }
}

#[tokio::main]
async fn main() {
    let addr = "127.0.0.1:5252".parse().unwrap();

    let profile_service = ProfileService {};

    let svc = ProfileServer::new(profile_service);

    mongo_service::init_client().await;
    cache_service::init_client();

    cache_service::get_client().unwrap().flush().unwrap();

    println!("Server listening on {}", addr);

    Server::builder()
        .add_service(svc)
        .serve(addr)
        .await
        .unwrap();
}
