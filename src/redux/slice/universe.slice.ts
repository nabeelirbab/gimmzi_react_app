import {createSlice, PayloadAction} from '@reduxjs/toolkit';

interface UserState {
  category: any;
  types: any;
  distance: any;
  lists: any;
  // Filter
  selectCategory: any;
  // index
  index: number;
}

const initialState: UserState = {
  category: [],
  distance: [],
  types: [],
  lists: [],
  // Filter
  selectCategory: null,
  index: 0,
};

const universeSlice = createSlice({
  name: 'universe',
  initialState,
  reducers: {
    setUniverseCategory(state, action: PayloadAction<any | null>) {
      state.category = action.payload;
    },
    setUniverseTypes(state, action: PayloadAction<any | null>) {
      state.types = action.payload;
    },
    setUniverseDistance(state, action: PayloadAction<any | null>) {
      state.distance = action.payload;
    },

    setUniverseBusinessList(state, action: PayloadAction<any | null>) {
      state.lists = action.payload;
    },

    setSelectCategory(state, action: PayloadAction<any | null>) {
      state.selectCategory = action.payload;
    },
    setIndexOfDeals(state, action: PayloadAction<any | null>) {
      state.index = action.payload;
    },
  },
});

export const {
  setUniverseCategory,
  setUniverseTypes,
  setUniverseDistance,
  setUniverseBusinessList,
  setSelectCategory,
  setIndexOfDeals,
} = universeSlice.actions;
export default universeSlice.reducer;
