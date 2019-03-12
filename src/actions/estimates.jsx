import dayjs from 'dayjs';
import { prices, availability } from '@windingtree/wt-pricing-algorithms';
import { fetchHotelRatePlans, fetchHotelRoomTypes, fetchHotelAvailability } from './hotels';

export const recomputeHotelEstimates = ({ id }) => (dispatch, getState) => {
  const state = getState();
  const hotel = state.hotels.list.find(h => h.id === id);
  if (!hotel) {
    return;
  }
  if (!hotel.roomTypes || !hotel.ratePlans) {
    return;
  }
  const { guest: guestData } = state.booking;
  if (
    !guestData
    || !guestData.arrival
    || !guestData.departure
    || !guestData.guests
    || !guestData.guests.length
  ) {
    return;
  }

  const computer = new prices.PriceComputer(
    hotel.roomTypes,
    hotel.ratePlans,
    hotel.currency,
  );

  const pricingEstimates = computer.getBestPrice(
    dayjs(),
    guestData.helpers.arrivalDateDayjs,
    guestData.helpers.departureDateDayjs,
    guestData.guests,
  ).map((pe) => {
    if (!pe.prices || !pe.prices.length) {
      return pe;
    }
    return Object.assign(pe, {
      // This might not work that easily for other pricing strategies
      currency: pe.prices[0].currency,
      price: pe.prices[0].total,
    });
  });

  const quantities = hotel.availability && hotel.availability.items
    ? availability.computeAvailability(
      guestData.arrival,
      guestData.departure,
      guestData.guests.length,
      hotel.roomTypes,
      hotel.availability.items,
    ) : [];
  dispatch({
    type: 'SET_ESTIMATES',
    payload: {
      id,
      data: pricingEstimates.map((pd) => {
        const quantityWrapper = quantities.find(q => q.roomTypeId === pd.id);
        return Object.assign({}, pd, {
          quantity: quantityWrapper ? quantityWrapper.quantity : undefined,
        });
      }),
    },
  });
};

export const fetchAndComputeHotelEstimates = ({
  id, ratePlans, roomTypes, availabilityData,
}) => (dispatch) => {
  let ratePlansPromise;
  let roomTypesPromise;
  let availabilityPromise;
  // Do not hit hotels with rate plans already downloaded
  if (ratePlans) {
    ratePlansPromise = Promise.resolve();
  } else {
    // silent catch, the errors are dealt with in appropriate reducers
    ratePlansPromise = dispatch(fetchHotelRatePlans({ id })).catch(() => {});
  }
  // Do not hit hotels with room types already downloaded
  if (roomTypes) {
    roomTypesPromise = Promise.resolve();
  } else {
    // silent catch, the errors are dealt with in appropriate reducers
    roomTypesPromise = dispatch(fetchHotelRoomTypes({ id })).catch(() => {});
  }
  // Do not hit hotels with availability already downloaded
  if (availabilityData) {
    availabilityPromise = Promise.resolve();
  } else {
    // silent catch, the errors are dealt with in appropriate reducers
    availabilityPromise = dispatch(fetchHotelAvailability({ id })).catch(() => {});
  }
  // for each hotel in parallel get rate plan, room types, availability and recompute estimates
  return Promise.all([ratePlansPromise, roomTypesPromise, availabilityPromise])
    .then(() => dispatch(recomputeHotelEstimates({ id })));
};

export const recomputeAllPrices = ({
  _formActions,
}) => (dispatch, getState) => {
  // Collect all rate plans
  const state = getState();
  const ratePlansPromises = state.hotels.list.map(h => dispatch(fetchAndComputeHotelEstimates(h)));
  // Wait for everything and enable form resubmission
  Promise.all(ratePlansPromises).then(() => {
    _formActions.setSubmitting(false);
  });
};

export default {
  recomputeAllPrices,
  recomputeHotelEstimates,
  fetchAndComputeHotelEstimates,
};
