import { soliditySha3 } from 'web3-utils';
import { createActionThunk } from 'redux-thunk-actions';
import dayjs from 'dayjs';
import { Wallet } from '@windingtree/wt-js-libs';
import { cancellationFees } from '@windingtree/wt-pricing-algorithms';

import {
  Http404Error,
  HttpBadRequestError,
  HttpConflictError,
  HttpError,
  HttpInternalServerError,
} from '../services/errors';
import walletData from '../assets/signing/wallet';

export const setGuestData = ({ arrival, departure, guests }) => (dispatch) => {
  dispatch({
    type: 'SET_STAY_DATA',
    payload: {
      arrival,
      departure,
    },
  });
  dispatch({
    type: 'SET_GUEST_DATA',
    payload: {
      guests,
    },
  });
};

export const addRoomType = ({ hotelId, roomTypeId }) => (dispatch) => {
  dispatch({
    type: 'ADD_ROOM_TYPE',
    payload: {
      hotelId,
      roomTypeId,
    },
  });
};

export const determineCancellationFees = ({ hotelId }) => (dispatch, getState) => {
  const state = getState();
  const hotel = state.hotels.list.find(h => h.id === hotelId);
  if (!hotel) {
    return;
  }
  if (!state.booking || !state.booking.guest || !state.booking.guest.helpers) {
    return;
  }
  const arrivalDayjs = state.booking.guest.helpers.arrivalDateDayjs;
  const fees = cancellationFees.computeCancellationFees(
    dayjs(), // today
    arrivalDayjs,
    hotel.cancellationPolicies,
    hotel.defaultCancellationAmount,
  );
  dispatch({
    type: 'SET_CANCELLATION_FEES',
    payload: {
      hotelId,
      fees,
    },
  });
};

export const translateNetworkError = (status, code, message) => {
  if (status === 400) {
    return new HttpBadRequestError(code, message);
  }
  if (status === 404) {
    return new Http404Error(code, message);
  }
  // Consider 422 as a 409
  if (status === 409 || status === 422) {
    return new HttpConflictError(code, message);
  }
  if (status === 500) {
    return new HttpInternalServerError(code, message);
  }
  const e = new HttpError(code, message);
  e.status = status;
  return e;
};

const loadWallet = () => {
  if (!window.env.ETH_NETWORK_PROVIDER) {
    throw new Error('No ETH_NETWORK_PROVIDER set.');
  }
  const wallet = Wallet.createInstance(walletData);
  const walletPassword = 'test123'; // don't use this wallet in production!
  wallet.setupWeb3Eth(process.env.ETH_NETWORK_PROVIDER);
  wallet.unlock(walletPassword);
  return wallet;
};

/**
 * Prepare options for a booking request. If WT_SIGN_BOOKING_REQUESTS is true,
 * sign the request using provided ethereum wallet.
 *
 * @param method {String} HTTP method of the request
 * @param data {String} Serialized data (body or uri depending on method)
 * @returns {Promise<{headers: {}, method: String, body?: {}}>}
 */
export const prepareRequestOptions = async (method, data) => {
  const headers = {};
  if (window.env.WT_SIGN_BOOKING_REQUESTS === 'true') {
    const wallet = loadWallet();
    const dataHash = soliditySha3(data);
    const signature = await wallet.signData(dataHash);
    headers['x-wt-signature'] = signature;
    if (method === 'DELETE') {
      headers['x-wt-origin-address'] = wallet.getAddress();
    }
  }
  const options = {
    method,
    headers,
  };
  if (method === 'POST') {
    options.body = data;
    headers['content-type'] = 'application/json';
  }
  return options;
};

export const sendBooking = createActionThunk('SEND_BOOKING', async ({ bookingData, bookingUri }) => {
  const uri = `${bookingUri}/booking`;
  const bookingContents = bookingData;
  if (window.env.WT_SIGN_BOOKING_REQUESTS === 'true') {
    const wallet = loadWallet();
    bookingContents.originAddress = wallet.getAddress();
  }
  const options = await prepareRequestOptions('POST', JSON.stringify(bookingContents));
  return fetch(uri, options)
    .then((response) => {
      if (response.status > 299) {
        throw translateNetworkError(response.status, 'Cannot save booking!');
      }
      return response.json();
    })
    .then(data => ({
      id: data.id,
      status: data.status,
    }));
});

export const submitBooking = values => (dispatch, getState) => {
  const state = getState();
  const hotel = state.hotels.list.find(h => h.id === values.hotelId);
  if (!hotel || !hotel.bookingUri) {
    return;
  }
  dispatch({
    type: 'SET_CUSTOMER',
    payload: {
      customer: values.customer,
    },
  });
  dispatch({
    type: 'SET_GUEST_DATA',
    payload: {
      guests: values.booking.guestInfo,
    },
  });
  const { ...bookingData } = values;
  dispatch(sendBooking({
    bookingUri: hotel.bookingUri,
    bookingData,
  }));
};

export const cancelBooking = createActionThunk('CANCEL_BOOKING', async (values) => {
  const uri = `${values.bookingUri}/booking/${values.bookingId}`;
  const options = await prepareRequestOptions('DELETE', uri);
  return fetch(uri, options)
    .then((response) => {
      if (response.status === 204) {
        return { status: 204, code: 'ok' };
      }
      return response.json();
    })
    .then((response) => {
      values.finalize(response.status <= 299, response.code);
    }, () => {
      values.finalize(false, undefined);
    });
});

export default {
  setGuestData,
  addRoomType,
  determineCancellationFees,
  submitBooking,
  cancelBooking,
};
