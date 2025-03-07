import {configureStore} from '@reduxjs/toolkit';
import authReducer from './slice/auth.slice';
import userReducer from './slice/user.slice';
import universeReducer from './slice/universe.slice';
import walletReducer from './slice/wallet.slice';
import {TypedUseSelectorHook, useDispatch, useSelector} from 'react-redux';

const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    universe: universeReducer,
    wallet: walletReducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      thunk: true, // Ensure thunk middleware is enabled
    }),
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export {store};
