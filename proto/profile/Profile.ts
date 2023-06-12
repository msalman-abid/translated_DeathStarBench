// Original file: proto/profile.proto

import type * as grpc from '@grpc/grpc-js'
import type { MethodDefinition } from '@grpc/proto-loader'
import type { Request as _profile_Request, Request__Output as _profile_Request__Output } from '../profile/Request';
import type { Result as _profile_Result, Result__Output as _profile_Result__Output } from '../profile/Result';

export interface ProfileClient extends grpc.Client {
  GetProfiles(argument: _profile_Request, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_profile_Result__Output>): grpc.ClientUnaryCall;
  GetProfiles(argument: _profile_Request, metadata: grpc.Metadata, callback: grpc.requestCallback<_profile_Result__Output>): grpc.ClientUnaryCall;
  GetProfiles(argument: _profile_Request, options: grpc.CallOptions, callback: grpc.requestCallback<_profile_Result__Output>): grpc.ClientUnaryCall;
  GetProfiles(argument: _profile_Request, callback: grpc.requestCallback<_profile_Result__Output>): grpc.ClientUnaryCall;
  getProfiles(argument: _profile_Request, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_profile_Result__Output>): grpc.ClientUnaryCall;
  getProfiles(argument: _profile_Request, metadata: grpc.Metadata, callback: grpc.requestCallback<_profile_Result__Output>): grpc.ClientUnaryCall;
  getProfiles(argument: _profile_Request, options: grpc.CallOptions, callback: grpc.requestCallback<_profile_Result__Output>): grpc.ClientUnaryCall;
  getProfiles(argument: _profile_Request, callback: grpc.requestCallback<_profile_Result__Output>): grpc.ClientUnaryCall;
  
}

export interface ProfileHandlers extends grpc.UntypedServiceImplementation {
  GetProfiles: grpc.handleUnaryCall<_profile_Request__Output, _profile_Result>;
  
}

export interface ProfileDefinition extends grpc.ServiceDefinition {
  GetProfiles: MethodDefinition<_profile_Request, _profile_Result, _profile_Request__Output, _profile_Result__Output>
}
