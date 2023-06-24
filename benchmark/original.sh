# use ghz template function to generate random hotelIds and bench with 200 requests (default)
ghz --insecure \
    --proto ./proto/profile.proto \
    --call profile.Profile.GetProfiles \
    -n 500 \
    -d '{"hotelIds": ["{{randomInt 1 80}}"],"locale":"officia velit"}' \
    127.0.0.1:8090