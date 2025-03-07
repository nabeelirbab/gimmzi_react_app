import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {CURRENT_LOCATION_TYPE} from '../../types';

interface UserState {
  userInfo: any;
  location: CURRENT_LOCATION_TYPE;
  address: string;
  // Other user-related state properties
}

const initialState: UserState = {
  userInfo: null,
  location: {
    heading: -1,
    latitude: 42.35579944570503,
    latitudeDelta: 0.01,
    longitude: -71.06120977588873,
    longitudeDelta: 0.01,
  },
  address: '',
  // Initialize other state properties
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserInfo(state, action: PayloadAction<any | null>) {
      state.userInfo = action.payload;
    },
    setUserCurrentLocation(state, action: PayloadAction<any | null>) {
      state.location = action.payload;
      
    },
    setUserAddress(state, action: PayloadAction<any | null>) {
      state.address = action.payload;
    },
  },
});

export const {setUserInfo, setUserCurrentLocation, setUserAddress} =
  userSlice.actions;
export default userSlice.reducer;
