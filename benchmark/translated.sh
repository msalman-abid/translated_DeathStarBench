
# if first argument not equal to rust or nodejs, print usage and exit
if [ "$1" != "rust" ] && [ "$1" != "nodejs" ];
then
    echo "Usage: ./benchmark/translated.sh <rust|nodejs>"
    exit 1
fi

if [ "$1" == "nodejs" ];
then
    PORT=50051
fi

if [ "$1" == "rust" ];
then
    PORT=5252
fi

# use ghz template function to generate random hotelIds and bench with 200 requests (default)
ghz --insecure \
    --proto ./proto/profile.proto \
    --call profile.Profile.GetProfiles \
    -n 500 \
    -d '{"hotelIds": ["{{randomInt 1 80}}"],"locale":"officia velit"}' \
    127.0.0.1:$PORT