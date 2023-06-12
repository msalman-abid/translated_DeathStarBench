import type * as grpc from '@grpc/grpc-js';
import type { MessageTypeDefinition } from '@grpc/proto-loader';

import type { ProfileClient as _profile_ProfileClient, ProfileDefinition as _profile_ProfileDefinition } from './profile/Profile';

type SubtypeConstructor<Constructor extends new (...args: any) => any, Subtype> = {
  new(...args: ConstructorParameters<Constructor>): Subtype;
};

export interface ProtoGrpcType {
  profile: {
    Address: MessageTypeDefinition
    Hotel: MessageTypeDefinition
    Image: MessageTypeDefinition
    Profile: SubtypeConstructor<typeof grpc.Client, _profile_ProfileClient> & { service: _profile_ProfileDefinition }
    Request: MessageTypeDefinition
    Result: MessageTypeDefinition
  }
}

