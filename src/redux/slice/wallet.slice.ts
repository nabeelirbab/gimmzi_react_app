import {createSlice, PayloadAction} from '@reduxjs/toolkit';

interface WalletState {
  lists: any;
  count: number;
  earned_points: number;
  total_points: number;
  lastDate:string;
  updatedPoint:number;
}

const initialState: WalletState = {
  lists: [],
  count: 0,
  earned_points: 0,
  total_points: 0,
  lastDate:'',
  updatedPoint:0
  // Initialize other state properties
};

const walletSlice = createSlice({
  name: 'wallet',
  initialState,
  reducers: {
    setWalletList(state, action: PayloadAction<any | null>) {
      state.lists = action.payload;
    },
    setWalletCount(state, action: PayloadAction<any | null>) {
      state.count = action.payload;
    },
    setPoints(
      state,
      action: PayloadAction<{
        totalearnedPoints: number;
        totalPoints: number;
      }>,
    ) {
      state.total_points = action.payload?.totalPoints;
      state.earned_points = action.payload?.totalearnedPoints;
    },
    setLastReedeemLoyality(state, action: PayloadAction<any | null>) {
      state.lastDate = action.payload;
    },
    setUpdatedEarnedPoint(state, action: PayloadAction<any | null>) {
      state.updatedPoint = action.payload;
    },
    // Other user reducers
  },
});

export const {setWalletList, setWalletCount, setPoints,setLastReedeemLoyality,setUpdatedEarnedPoint} = walletSlice.actions;
export default walletSlice.reducer;
