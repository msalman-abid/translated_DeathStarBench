#[derive(Debug)]
struct ProfileService;

pub mod profile {
    tonic::include_proto!("profile");
}

use profile::profile_server::{Profile, ProfileServer};
use tonic::transport::Server;
use tonic::{Response, Status};

use mongo::mongo_service;

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

        let hotels_from_db = mongo_service::get_hotels(hotel_ids).await;

        let reply: profile::Result = profile::Result {
            hotels: hotels_from_db,
        };

        Ok(Response::new(reply))
    }
}

#[tokio::main]
async fn main() {
    let addr = "[::1]:5252".parse().unwrap();

    let profile_service = ProfileService {};

    let svc = ProfileServer::new(profile_service);

    mongo_service::init_client().await;

    println!("Server listening on {}", addr);

    Server::builder()
        .add_service(svc)
        .serve(addr)
        .await
        .unwrap();
}
