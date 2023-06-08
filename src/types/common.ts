export interface ProfileService {
  getProfiles(request: Request): Promise<Result>;
}

export interface Request {
  hotelIds: string[];
  locale: string;
}

export interface Result {
  hotels: Hotel[];
}

export interface Hotel {
  id: string;
  name: string;
  phoneNumber: string;
  description: string;
  address: Address;
}

export interface Address {
  streetNumber: string;
  streetName: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  lat: number;
  lon: number;
}

export interface Image {
  url: string;
  default: boolean;
}
