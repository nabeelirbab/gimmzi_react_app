import {Dispatch} from 'redux';
import {AxiosResponse} from 'axios';
import {instance} from '../server/instance';
import {API} from '../constants';
import {
  ADD_WALLET_TYPE,
  WALLET_LIST_TYPE,
  WALLET_REDEEM_TYPE,
} from '../../types';
import {
  setLastReedeemLoyality,
  setPoints,
  setUpdatedEarnedPoint,
  setWalletCount,
  setWalletList,
} from '../../redux/slice/wallet.slice';

const {wallet} = API;

const _header = {
  headers: {
    'Content-Type': 'multipart/form-data',
  },
};

const addWallet = (payload: ADD_WALLET_TYPE) => {
  return async (dispatch: Dispatch) => {
    try {
      const result: AxiosResponse<any> = await instance.post(
        wallet.add_wallet,
        payload,
        _header,
      );
      const {status, data} = result;

      return {
        success: status === 200 && data?.status === 201,
        message: data?.message,
        data: result?.data?.data,
      };
    } catch (error: any) {
      return {
        success: false,
        message: `${error.response?.data?.message}`,
      };
    }
  };
};

const getWalletList = (payload: WALLET_LIST_TYPE) => {
  return async (dispatch: Dispatch) => {
    try {
      const result: AxiosResponse<any> =
        payload !== undefined && payload !== null
          ? Object.keys(payload).length === 0
            ? await instance.post(wallet.wallet_list, _header)
            : await instance.post(wallet.wallet_list, payload, _header)
          : await instance.post(wallet.wallet_list, _header);

      const {status, data} = result;

      // console.log('getWalletList payload - - - ',payload);
      console.log('getWalletList result - - - ',data,result);

      if (data?.status === 201) {
        dispatch(setWalletList(result?.data?.data));
      }

      return {
        success: status === 200 && data?.status === 201,
        message: data?.message,
        data: result?.data?.data,
      };
    } catch (error: any) {
      return {
        success: false,
        message: `${error.response?.data?.message}`,
      };
    }
  };
};

const redeemProgram = (payload: WALLET_REDEEM_TYPE) => {
  return async (dispatch: Dispatch) => {
    try {
      const result: AxiosResponse<any> = await instance.post(
        wallet.redeem_program,
        payload,
        _header,
      );
      const {status, data} = result;
    console.log("result redeemProgram",result);
    
      console.log('status, data redeem error -- ', status, data,result);

      return {
        success: status === 200 && data?.status === 201,
        message: data?.message,
        data: result?.data?.data,
      };
    } catch (error: any) {

      return {
        success: false,
        message: `${error.response?.data?.message}`,
      };
    }
  };
};

const removeWallet = (payload: {wallet_id: number}) => {
  return async (dispatch: Dispatch) => {
    try {
      const result: AxiosResponse<any> = await instance.post(
        wallet.remove_wallet,
        payload,
        _header,
      );
      const {status, data} = result;
console.log("result removeWallet",result);

      return {
        success: status === 200 && data?.status === 201,
        message: data?.message,
      };
    } catch (error: any) {
      console.log('error - - - - -- - ', error);

      return {
        success: false,
        message: `${error.response?.data?.message}`,
      };
    }
  };
};

const getWalletCount = () => {
  return async (dispatch: Dispatch) => {
    try {
      const result: AxiosResponse<any> = await instance.get(
        wallet.wallet_count,
      );
      const {status, data} = result;
      console.log("result wallet count",result);
      

      // if (data?.data) {
        dispatch(setWalletCount(data?.data));
      // }

      return {
        success: status === 200 && data?.status === 201,
        // message: data?.message,
      };
    } catch (error: any) {
      console.log('error - - - - -- - ', error);

      return {
        success: false,
        // message: `${error.response?.data?.message}`,
      };
    }
  };
};

const getUpdatedEarnedPoint = () => {
  return async (dispatch: Dispatch) => {
    try {
      const result: AxiosResponse<any> = await instance.get(
        wallet.updated_earned_point,
      );
      const {status, data} = result;
     console.log("result setUpdatedEarnedPoint",result);
     
      if (data?.status==201) {
        dispatch(setUpdatedEarnedPoint(data?.data));
      }

      return {
        success: status === 200 && data?.status === 201,
        message: data?.message,
      };
    } catch (error: any) {
      console.log('error getUpdatedEarnedPoint - - - - -- - ', error);

      return {
        success: false,
        // message: `${error.response?.data?.message}`,
      };
    }
  };
};

const getEarnedLoyaltyPoints = () => {
  return async (dispatch: Dispatch) => {
    try {
      const result: AxiosResponse<any> = await instance.get(
        wallet.earned_loyalty_points,
      );
      const {status, data} = result;

      console.log('Earned Loyalty Points: ', data);

      if (data?.status === 201) {
        dispatch(setPoints(data?.data));
      }

      return {
        success: status === 200 && data?.status === 201,
        // message: data?.message,
      };
    } catch (error:any) {
      return {
        success: false,
      };
    }
  };
};

const getRemainingPurchaseAmount = () => {
  return async (dispatch: Dispatch) => {
    try {
      const result: AxiosResponse<any> = await instance.get(
        wallet.remaining_purchase_amount,
      );
      const {status, data} = result;

      if (data?.status === 200) {
        // dispatch(setEarnedPoints(data?.data));
      }

      return {
        success: status === 200 && data?.status === 201,
        message: data?.message,
      };
    } catch (error) {}
  };
};

const getLastRedeemLoyality = () => {
  return async (dispatch: Dispatch) => {
    try {
      const result: AxiosResponse<any> = await instance.get(
        wallet.last_redeem_loyality,
      );
      const {status, data} = result;

      if (data?.data) {
        dispatch(setLastReedeemLoyality(data?.data));

      }
console.log("getLastRedeemLoyality data",data);

      return {
        success: status === 200 && data?.status === 201,
        // message: data?.message,
      };
    } catch (error: any) {
      console.log('error - - - - -- - ', error);

      return {
        success: false,
        // message: `${error.response?.data?.message}`,
      };
    }
  };
};

export {
  addWallet,
  getWalletList,
  redeemProgram,
  removeWallet,
  getWalletCount,
  getEarnedLoyaltyPoints,
  getRemainingPurchaseAmount,
  getLastRedeemLoyality,
  getUpdatedEarnedPoint
};
