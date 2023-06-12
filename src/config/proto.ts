import { loadPackageDefinition } from '@grpc/grpc-js';
import { loadSync } from '@grpc/proto-loader';
import { ProtoGrpcType } from "../../proto/profile";

const PROTO_PATH = __dirname + '/../../proto/profile.proto';
const packageDefinition = loadSync(PROTO_PATH);
const protoDescriptor = loadPackageDefinition(packageDefinition) as unknown as ProtoGrpcType;

export default protoDescriptor;