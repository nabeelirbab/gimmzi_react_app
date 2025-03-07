import {Dispatch} from 'redux';
import {AxiosResponse} from 'axios';
import {instance} from '../server/instance';
import {API} from '../constants';
import {createFrom} from '../helper/Validation';
import {setUserInfo} from '../../redux/slice/user.slice';
import {EDIT_PROFILE_TYPE, LOCATION_TYPE} from '../../types';

const {user} = API;

const _header = {
  headers: {
    'Content-Type': 'multipart/form-data',
  },
};

const getUserDetails = () => {
  console.log('Call API -- getUserDetails');

  return async (dispatch: Dispatch) => {
    try {
      const result: AxiosResponse<any> = await instance.get(user.profile);
      const {status, data} = result;

      console.log('User Details:', data,result);

      if (data?.status === 200) {
        dispatch(setUserInfo(result?.data?.data));
      }

      return {
        success: status === 200 && data?.status === 200,
        message: data?.message,
      };
    } catch (error: any) {
      return {
        success: false,
        message: `${error.response?.data?.message}`,
      };
    }
  };
};

const updateUserDetails = (payload: EDIT_PROFILE_TYPE) => {
  return async (dispatch: Dispatch) => {
    try {
      const result: AxiosResponse<any> = await instance.post(
        user.edit_profile,
        createFrom(payload),
        _header,
      );
      const {status, data} = result;
console.log("result update profile",result);

      return {
        success: status === 200 && data?.status === 201,
        message: data?.message,
      };
    } catch (error: any) {
      let _message = error.response?.data?.message;
      return {
        success: false,
        message:
          _message === 'The phone has already been taken.'
            ? 'The phone number has already been taken'
            : `${_message}`,
      };
    }
  };
};

const updateCurrentLocation = (payload: LOCATION_TYPE) => {
  return async (dispatch: Dispatch) => {
    try {
      const result: AxiosResponse<any> = await instance.post(
        user.update_location,
        createFrom(payload),
        _header,
      );
      const {status, data} = result;
console.log("result updateLocation",result);

      return {
        success: status === 200 && data?.status === 201,
        message: data?.message,
      };
    } catch (error: any) {
      return {
        success: false,
        message: `${error.response?.data?.message}`,
      };
    }
  };
};

export {getUserDetails, updateUserDetails, updateCurrentLocation};
