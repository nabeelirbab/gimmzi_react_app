import {Dispatch} from 'redux';
import {setUserEmail, setUserStatus} from '../../redux/slice/auth.slice';
import axios, {AxiosResponse} from 'axios';
import {instance} from '../server/instance';
import {API} from '../constants';
import {GOOGLE_API_KEY} from '@env';
import {
  GeocodeResponse,
  Location,
  SIGN_IN_TYPE,
  SIGN_UP_TYPE,
} from '../../types';
import {createFrom} from '../helper/Validation';
import Storage from '../stroage';
import {navigate} from '../helper/RootNaivgation';
import { setSelectCategory } from '../../redux/slice/universe.slice';

const {auth} = API;

const _header = {
  headers: {
    'Content-Type': 'multipart/form-data',
  },
};

const checkEmail = (payload: {email: string}) => {
  return async (dispatch: Dispatch) => {
    try {
      const {email} = payload;

      const result: AxiosResponse<any> = await instance.post(auth.check_email, {
        email,
      });

      const {status, data} = result;
      console.log("result email",result);
      
      dispatch(setUserEmail({email}));

      if (status === 200 && data?.status !== 201) {
        navigate('SignUp');
      }

      return {
        success: status === 200 && data?.status === 201,
        message: data?.message,
      };
    } catch (error: any) {
      console.log("error",error);
      
      return {
        success: false,
        message: error?.response
          ? `${error.response?.data?.message}`
          : `${error?.message}`,
      };
    }
  };
};

const getCityAndStateFromZip = async (
  zipCode: string,
): Promise<Location | null> => {
  try {
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${zipCode}&key=${GOOGLE_API_KEY}`;

    const response = await axios.get<GeocodeResponse>(url);

    if (response.data.status === 'OK') {
      const addressComponents = response.data.results[0].address_components;

      let city = '';
      let state = '';

      addressComponents.forEach(component => {
        if (component.types.includes('locality')) {
          city = component.long_name;
        }
        if (component.types.includes('administrative_area_level_1')) {
          state = component.long_name;
        }
      });

      return {city, state};
    } else {
      throw new Error('Unable to fetch location details');
    }
  } catch (error) {
    console.log(error);
    return null;
  }
};

const signUp = (payload: SIGN_UP_TYPE) => {
  return async (dispatch: Dispatch) => {
    try {
      const result: AxiosResponse<any> = await instance.post(
        auth.signup,
        createFrom(payload),
        _header,
      );

      const {status, data} = result;
console.log("result signup", result);

      return {
        success: status === 200 && data?.status === 201,
        message: data?.message,
      };
    } catch (error: any) {
      console.log("error signup",error);
      
      let _message = error?.response
        ? error.response?.data?.message
        : error?.message;
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

const signIn = (payload: SIGN_IN_TYPE) => {
  return async (dispatch: Dispatch) => {
    try {
      const result: AxiosResponse<any> = await instance.post(
        auth.login,
        createFrom(payload),
        _header,
      );

      const {status, data} = result;
console.log("result signin",result);

      if (status === 200 && data?.status === 201) {
        Storage.setItem('token', data?.data?.token);
        dispatch(setUserStatus(true));
        return {
          success: true,
          message: data?.message,
        };
      } else {
        return {
          success: false,
          message: data?.message,
        };
      }
    } catch (error: any) {
      return {
        success: false,
        message: error?.response
          ? `${error.response?.data?.message}`
          : `${error?.message}`,
      };
    }
  };
};

const forgotPassword = (payload: {email: string}) => {
  return async (dispatch: Dispatch) => {
    try {
      const result: AxiosResponse<any> = await instance.post(
        auth.forgot_password,
        createFrom(payload),
        _header,
      );

      const {status, data} = result;
      return {
        success: status === 200 && data?.status === 201,
        message: data?.message,
      };
    } catch (error: any) {
      return {
        success: false,
        message: error?.response
          ? `${error.response?.data?.message}`
          : `${error?.message}`,
      };
    }
  };
};

const logout = () => {
  return async (dispatch: Dispatch) => {
    try {
      const result: AxiosResponse<any> = await instance.get(auth.logout);

      console.log('logout result --- ', result);

      const {status, data} = result;

      if (status === 200 && data?.status === 201) {
        Storage.clearAll();
        dispatch(setUserStatus(false));
        dispatch(setSelectCategory(null));
      }

      return {
        success: status === 200 && data?.status === 201,
        message: data?.message,
      };
    } catch (error: any) {
      if (error?.response) {
        Storage.clearAll();
        dispatch(setUserStatus(false));
      }

      return {
        success: false,
        // message: error?.response
        //   ? `${error.response?.data?.message}`
        //   : `${error?.message}`,
      };
    }
  };
};

const deleteAccount = () => {
  return async (dispatch: Dispatch) => {
    try {
      const result: AxiosResponse<any> = await instance.post(auth.deleteAccount,_header);

      console.log('delete account result --- ', result);

      const {status, data} = result;

      if (status === 200 && data?.status === 201) {
        Storage.clearAll();
        dispatch(setUserStatus(false));
        dispatch(setSelectCategory(null));
      }

      return {
        success: status === 200 && data?.status === 201,
        message: data?.message,
      };
    } catch (error: any) {
      if (error?.response) {
        Storage.clearAll();
        dispatch(setUserStatus(false));
      }

      return {
        success: false,
        message: error?.response
          ? `${error.response?.data?.message}`
          : `${error?.message}`,
      };
    }
  };
};

// need to use if the api is ready
const getPrivacyPolicyTermsCondition = async () => {
  try {
    const result: AxiosResponse<any> = await instance.get(auth.privacyPolicy);

    const {status, data} = result;

    return {
      success: status === 200 && data?.status === 201,
      message: data?.message,
      data: result?.data?.data,
    };
  } catch (error) {
    console.log(error);
    return null;
  }
};

export {
  checkEmail,
  getCityAndStateFromZip,
  signUp,
  signIn,
  forgotPassword,
  logout,
  getPrivacyPolicyTermsCondition,
  deleteAccount,
};
