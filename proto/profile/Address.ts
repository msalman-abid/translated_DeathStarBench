// Original file: proto/profile.proto


export interface Address {
  'streetNumber'?: (string);
  'streetName'?: (string);
  'city'?: (string);
  'state'?: (string);
  'country'?: (string);
  'postalCode'?: (string);
  'lat'?: (number | string);
  'lon'?: (number | string);
}

export interface Address__Output {
  'streetNumber': (string);
  'streetName': (string);
  'city': (string);
  'state': (string);
  'country': (string);
  'postalCode': (string);
  'lat': (number);
  'lon': (number);
}
