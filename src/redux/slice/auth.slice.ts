import {createSlice, PayloadAction} from '@reduxjs/toolkit';

interface AuthState {
  email: any;
  loading: boolean;
  isLoggedIn: boolean;
}

const initialState: AuthState = {
  email: null,
  loading: true,
  isLoggedIn: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUserEmail(state, action: PayloadAction<any | null>) {
      state.email = action.payload?.email;
    },
    setUserStatus(state, action: PayloadAction<any | null>) {
      state.loading = false;
      state.isLoggedIn = action.payload
    },
  },
});

export const {setUserEmail, setUserStatus} = authSlice.actions;
export default authSlice.reducer;
