export interface AddressComponent {
  long_name: string;
  short_name: string;
  types: string[];
}

export interface GeocodeResult {
  address_components: AddressComponent[];
}

export interface GeocodeResponse {
  results: GeocodeResult[];
  status: string;
}

export interface Location {
  city: string;
  state: string;
}

export interface SIGN_UP_TYPE {
  first_name: string;
  last_name: string;
  phone: string;
  email: string;
  dob: string;
  zip_code: string;
  city: string;
  state: string;
  consumer_password: string;
  consumer_confirm_password: string;
}

export interface SIGN_IN_TYPE {
  email: string;
  password: string;
}

export interface EDIT_PROFILE_TYPE {
  first_name?: string;
  last_name?: string;
  phone?: string;
  dob?: string;
  zip_code?: string;
  user_photo?: {};
  old_password?: string;
  new_password?: string;
}

export interface LOCATION_TYPE {
  current_lat?: string;
  current_long?: string;
}

export interface CURRENT_LOCATION_TYPE {
  latitude: number;
  longitude: number;
  heading: number;
  latitudeDelta: number;
  longitudeDelta: number;
}

export interface UNIVERSE_FILTER_TYPE {
  category_id?: string;
  type?: string;
  distance_range?: string;
}

export interface UNIVERSE_DETAILS_TYPE {
  business_id?: number;
  location_id?: number;
}

export interface ADD_WALLET_TYPE {
  business_id: string;
  type: 'gimmziDeals' | 'loyaltyRewards';
  deal_id?: string;
  loyalty_id?: string;
}

export interface WALLET_LIST_TYPE {
  type?: 'gimmziDeals' | 'loyaltyRewards';
  filter_by?: 'is_expired' | 'is_redeemed';
}

export interface UNIVERSE_ADD_FAV_TYPE{
  type: 'gimmziDeals' | 'loyaltyRewards';
  deal_id?: string;
  loyalty_id?: string;
}

export interface SEARCH_BUSINESS{
  name: string;
  lat?: number;
  long?: number;
}

export interface WALLET_REDEEM_TYPE {
  type?: 'gimmziDeals' | 'loyaltyRewards';
  deal_id?: number;
  loyalty_id?: number;
  program_process?: string;
  location_id?: string;
  receipt_no?: string;
  gimmzi_id?: string
}

