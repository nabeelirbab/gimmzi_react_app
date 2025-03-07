import {Dispatch} from 'redux';
import {AxiosResponse} from 'axios';
import {instance} from '../server/instance';
import {API} from '../constants';
import {createFrom} from '../helper/Validation';
import {
  ADD_WALLET_TYPE,
  SEARCH_BUSINESS,
  UNIVERSE_ADD_FAV_TYPE,
  UNIVERSE_DETAILS_TYPE,
  UNIVERSE_FILTER_TYPE,
} from '../../types';
import {
  setUniverseBusinessList,
  setUniverseCategory,
  setUniverseDistance,
  setUniverseTypes,
} from '../../redux/slice/universe.slice';

const {universe, user} = API;

const _header = {
  headers: {
    'Content-Type': 'multipart/form-data',
  },
};

const header2={
  headers: {
    'Content-Type': 'application/json',
  },
}

const getUniverseAllCategory = () => {
  console.log('Call API - getUniverseAllCategory');
  return async (dispatch: Dispatch) => {
    try {
      const result: AxiosResponse<any> = await instance.get(universe.category);
      const {status, data} = result;

      if (data?.status === 201) {
        dispatch(setUniverseCategory(result?.data?.data));
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

const getUniverseAllTypes = () => {
  console.log('Call API - getUniverseAllTypes');
  return async (dispatch: Dispatch) => {
    try {
      const result: AxiosResponse<any> = await instance.get(universe.types);
      const {status, data} = result;

      if (data?.status === 201) {
        dispatch(setUniverseTypes(result?.data?.data));
      }

      var _data = [...result?.data?.data];
      if (result?.data?.data) {
        _data = _data.map(item => {
          if (item.text === 'Loyalty Rewards') {
            return {...item, text: 'Loyalty Punch Cards'};
          }
          return item;
        });
      }

      return {
        success: status === 200 && data?.status === 201,
        message: data?.message,
        data: _data,
      };
    } catch (error: any) {
      return {
        success: false,
        message: `${error.response?.data?.message}`,
      };
    }
  };
};

const getUniverseAllDistance = () => {
  console.log('Call API - getUniverseAllDistance');
  return async (dispatch: Dispatch) => {
    try {
      const result: AxiosResponse<any> = await instance.get(universe.distance);
      const {status, data} = result;

      if (data?.status === 201) {
        dispatch(setUniverseDistance(result?.data?.data));
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

// const getUniverseBusinessList = (payload: UNIVERSE_FILTER_TYPE) => {
//   console.log('payload getUniverseBusinessList-- ', payload);

//   return async (dispatch: Dispatch) => {
//     try {
//       const result: AxiosResponse<any> = await instance.post(
//         universe.universe_business_list,
//         (payload && Object.keys(payload).length > 0) ? payload : null,
//         _header
//       );
      
//       const {status, data} = result;

//       console.log('getUniverseBusinessList -- status, data -- ', status, data,result);

//       if (data?.status === 201) {
//         dispatch(setUniverseBusinessList(result?.data?.data));
//       }

//       return {
//         success: (status === 200 && data?.status === 201) || data?.code === 404,
//         message: data?.message,
//         data: data?.code === 404 ? [] : result?.data?.data
//       };
//     } catch (error: any) {
//       console.log('getUniverseBusinessList -- error -- ', error);

//       return {
//         success: false,
//         message: `${error.response?.data?.message}`,
//       };
//     }
//   };
// };


const getUniverseBusinessList = (payload: UNIVERSE_FILTER_TYPE) => {
  console.log("payload getUniverseBusinessList-- ", payload);

  return async (dispatch: Dispatch) => {
    let retries = 3; // Number of retry attempts
    let delay = 1000; // Initial delay in ms

    while (retries > 0) {
      try {
        const result: AxiosResponse<any> = await instance.post(
          universe.universe_business_list,
          payload && Object.keys(payload).length > 0 ? payload : null,
          _header
        );

        const { status, data } = result;
        console.log("getUniverseBusinessList -- status, data -- ", status, data,result);

        if (data?.status === 201) {
          dispatch(setUniverseBusinessList(result?.data?.data));
        }

        return {
          success: (status === 200 && data?.status === 201) || data?.code === 404,
          message: data?.message,
          data: data?.code === 404 ? [] : result?.data?.data,
        };
      } catch (error: any) {
        console.log("getUniverseBusinessList -- error -- ", error);

        // If it's a 429 error, wait and retry
        if (error.response?.status === 429 && retries > 0) {
          const retryAfter = error.response?.headers?.["retry-after"] || delay / 1000; // Get retry-after header if available
          console.warn(`Rate limited! Retrying in ${retryAfter} seconds...`);

          await new Promise((resolve) => setTimeout(resolve, retryAfter * 1000));
          delay *= 2; // Increase delay exponentially
          retries--;
          continue; // Retry the request
        }

        return {
          success: false,
          // message: error.response?.data?.message || "Something went wrong!",
        };
      }
    }

    return {
      success: false,
      message: "Too many requests. Please try again later.",
    };
  };
};



const getUniverseBusinessDetails = (payload: UNIVERSE_DETAILS_TYPE) => {
  return async (dispatch: Dispatch) => {
    try {
      const result: AxiosResponse<any> = await instance.post(
        universe.universe_business_details,
        createFrom(payload),
        _header,
      );
      const {status, data} = result;
console.log("result getUniverseBusinessDetails",result);

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

const addFavourite = (id: string) => {
  return async (dispatch: Dispatch) => {
    try {
      const result: AxiosResponse<any> = await instance.post(
        universe.add_favourite,
        {business_id: id},
        _header,
      );
      const {status, data} = result;
console.log("business fav----",result);

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
const dealsLoyalityAddFavourite = (payload: UNIVERSE_ADD_FAV_TYPE) => {
  return async (dispatch: Dispatch) => {
    try {
      const result: AxiosResponse<any> = await instance.post(
        universe.deal_loyality_add_favorite,
        payload,
        header2,
      );
      const {status, data} = result;
 console.log("result add fav deals/loyality",result,status,data);
 
      return {
        success: status === 200 && data?.status === 201,
        message: data?.message,
        data: result?.data?.data,
      };
    } catch (error: any) {
      console.log("error dealsLoyalityAddFavourite",error);
      
      return {
        success: false,
        message: `${error.response?.data?.message}`,
      };
    }
  };
};

const getFavourites = () => {
  return async (dispatch: Dispatch) => {
    try {
      const result: AxiosResponse<any> = await instance.get(
        user.favourite_list,
        _header,
      );
      const {status, data} = result;
      console.log('status fav list: ' + status, data,result);
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

const searchUniverseBusinessProfile = (payload:SEARCH_BUSINESS) => {
  return async (dispatch: Dispatch) => {
    try {
      const result: AxiosResponse<any> = await instance.post(
        universe.search_business_profile,
        payload,
        _header,
      );
      const {status, data} = result;
 console.log("searchUniverseBusinessProfile result",result);
 
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

export {
  getUniverseAllCategory,
  getUniverseAllTypes,
  getUniverseAllDistance,
  getUniverseBusinessList,
  getUniverseBusinessDetails,
  addFavourite,
  getFavourites,
  searchUniverseBusinessProfile,
  dealsLoyalityAddFavourite
};
