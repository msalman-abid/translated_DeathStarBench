// Original file: proto/profile.proto

import type { Address as _profile_Address, Address__Output as _profile_Address__Output } from '../profile/Address';
import type { Image as _profile_Image, Image__Output as _profile_Image__Output } from '../profile/Image';

export interface Hotel {
  'id'?: (string);
  'name'?: (string);
  'phoneNumber'?: (string);
  'description'?: (string);
  'address'?: (_profile_Address | null);
  'images'?: (_profile_Image)[];
}

export interface Hotel__Output {
  'id': (string);
  'name': (string);
  'phoneNumber': (string);
  'description': (string);
  'address': (_profile_Address__Output | null);
  'images': (_profile_Image__Output)[];
}
