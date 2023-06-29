#[derive(Debug)]
struct ProfileService;

pub mod profile {
    tonic::include_proto!("profile");
}

use profile::profile_server::{Profile, ProfileServer};
use profile::Hotel;
use tonic::transport::Server;
use tonic::{Response, Status};

#[tonic::async_trait]
impl Profile for ProfileService {
    async fn get_profiles(
        &self,
        request: tonic::Request<profile::Request>,
    ) -> Result<tonic::Response<profile::Result>, Status> {
        println!("Got a request: {:?}", request);
        let address1 = profile::Address::default();

        let reply = Hotel {
            id: '1'.into(),
            name: "Hotel California".into(),
            address: Some(address1),
            phone_number: "555-1234".into(),
            ..Default::default()
        };

        let reply_obj = profile::Result {
            hotels: vec![reply],
        };

        Ok(Response::new(reply_obj))
    }

}
#[tokio::main]
async fn main() {
    let addr = "[::1]:5252".parse().unwrap();

    let profile_service = ProfileService {};

    let svc = ProfileServer::new(profile_service);


    println!("Server listening on {}", addr);

    Server::builder()
        .add_service(svc)
        .serve(addr)
        .await
        .unwrap();

}
