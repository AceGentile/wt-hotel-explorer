import React from 'react';
import dayjs from 'dayjs';
import _get from 'lodash.get';
import _set from 'lodash.set';
import PropTypes from 'prop-types';
import {
  Formik, Form, Field, FieldArray,
} from 'formik';

import HotelInfoBox from '../HotelInfoBox';
import Loader from '../Loader';
import GuestInfoForm from './guest-info-form';
import CustomerForm from './customer-form';
import CancellationTerms from './cancellation-terms';
import RoomType from './room-type';

const requiredFields = {
  'customer.name': 'Name',
  'customer.surname': 'Surname',
  'customer.email': 'E-mail',
  'customer.address.road': 'Street',
  'customer.address.houseNumber': 'House number',
  'customer.address.city': 'City',
  'customer.address.countryCode': 'Country',
};

const BookingForm = ({
  hotel, guestData, hotelBookingData, customerData, estimates, handleBookingFormSubmit, error,
}) => {
  const initialValues = {
    booking: {
      arrival: guestData.arrival,
      departure: guestData.departure,
      guestInfo: guestData.guests,
      rooms: hotelBookingData.rooms,
    },
    note: '',
    customer: Object.assign({
      name: '', // req
      surname: '', // req
      email: '', // req
      phone: '',
      address: {
        road: '', // req
        houseNumber: '', // req
        postcode: '',
        city: '', // req
        state: '',
        countryCode: '', // req
      },
    }, customerData),
  };
  const firstRoomEstimate = estimates.find(x => x.id === initialValues.booking.rooms[0].id);
  initialValues.booking.rooms[0].guestInfoIds = initialValues.booking.guestInfo.map(g => g.id);

  const validate = (values) => {
    // TODO move date validation into a component, common code with GuestForm
    const errors = {};
    const normalizedArrival = dayjs(values.booking.arrival);
    const normalizedDeparture = dayjs(values.booking.departure);
    if (!normalizedArrival.isValid()) {
      _set(errors, 'booking.arrival', 'Invalid arrival date!');
    }
    if (!normalizedArrival.isAfter(dayjs())) {
      _set(errors, 'booking.arrival', 'Arrival date has to be in the future!');
    }
    if (!normalizedDeparture.isValid()) {
      _set(errors, 'booking.departure', 'Invalid departure date!');
    }
    // arrival has to be before departure
    if (normalizedArrival.isValid()
        && normalizedDeparture.isValid()
        && normalizedArrival.isAfter(normalizedDeparture)) {
      _set(errors, 'booking.arrival', 'Arrival has to be before departure!');
    }
    // Required fields
    const requiredKeys = Object.keys(requiredFields);
    for (let i = 0; i < requiredKeys.length; i += 1) {
      const val = _get(values, requiredKeys[i]);
      if (!val) {
        _set(errors, requiredKeys[i], `${requiredFields[requiredKeys[i]]} is required!`);
      }
    }
    // email
    if (values.customer && values.customer.email) {
      // props to https://emailregex.com/
      if (!/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(values.customer.email)) {
        _set(errors, 'customer.email', 'Invalid e-mail format!');
      }
    }
    // phone
    if (values.customer && values.customer.phone) {
      // props to https://www.regextester.com/1978
      if (!/^((?:\+|00)[17](?: |-)?|(?:\+|00)[1-9]\d{0,2}(?: |-)?|(?:\+|00)1-\d{3}(?: |-)?)?(0\d|\([0-9]{3}\)|[1-9]{0,3})(?:((?: |-)[0-9]{2}){4}|((?:[0-9]{2}){4})|((?: |-)[0-9]{3}(?: |-)[0-9]{4})|([0-9]{7}))$/.test(values.customer.phone)) {
        _set(errors, 'customer.phone', 'Invalid phone format!');
      }
    }

    return errors;
  };

  const doSubmit = (values) => {
    const customer = {
      name: values.customer.name,
      surname: values.customer.surname,
      address: values.customer.address,
      email: values.customer.email,
    };
    if (values.customer.phone !== '') {
      customer.phone = values.customer.phone;
    }
    const bookingData = {
      hotelId: hotel.id,
      customer,
      pricing: {
        currency: firstRoomEstimate.currency,
        total: firstRoomEstimate.price.value,
        cancellationFees: hotelBookingData.cancellationFees,
        // This might not work that easily for other pricing strategies
        // We also need to cleanup the currencyjs objects
        components: {
          stay: firstRoomEstimate.prices[0].components.stay.map(s => Object.assign(s, {
            subtotal: s.subtotal.value,
            guests: s.guests.map(g => Object.assign(g, {
              basePrice: g.basePrice.value,
              resultingPrice: g.resultingPrice.value,
            })),
          })),
        },
      },
      booking: values.booking,
    };
    if (values.note !== '') {
      bookingData.note = values.note;
    }
    handleBookingFormSubmit(bookingData);
  };

  return (
    <React.Fragment>
      <div className="row">
        <div className="col-md-12">
          <div className="text-center">
            <h1 className="my-1">
              {`Booking of ${hotel.name}`}
            </h1>
          </div>
        </div>
      </div>
      {error && (
        <div className="row mt-1">
          <div className="col-md-12">
            <div className="alert alert-danger">{`Cannot process booking: ${error}`}</div>
          </div>
        </div>
      )}
      <Formik
        initialValues={initialValues}
        validate={validate}
        onSubmit={doSubmit}
      >
        {({
          isSubmitting, values, errors, touched,
        }) => {
          const roomType = hotel.roomTypes.find(rt => rt.id === values.booking.rooms[0].id);
          let showSpinner = isSubmitting;
          if (error) {
            showSpinner = false;
          }
          return (
            <React.Fragment>
              {showSpinner && <Loader block={200} label="Submitting..." />}
              {!showSpinner && (
              <Form className="mb-2">
                <div className="row">
                  <div className="col-md-12">
                    <div className="card">
                      <div className="card-body">
                        <RoomType
                          roomType={roomType}
                        />
                      </div>
                    </div>
                    <div className="card">
                      <div className="card-body">
                        <div className="form-row mb-1">
                          <div className="col col-md-3">
                          Date of arrival
                          </div>
                          <div className="col">
                            <strong>{values.booking.arrival}</strong>
                          </div>
                        </div>
                        <div className="form-row mb-1">
                          <div className="col col-md-3">
                          Date of departure
                          </div>
                          <div className="col">
                            <strong>{values.booking.departure}</strong>
                          </div>
                        </div>
                        <div className="form-row mb-1">
                          <div className="col col-md-3">
                          Total price
                          </div>
                          <div className="col">
                            <strong>
                              {firstRoomEstimate.price.format()}
                              {' '}
                              {firstRoomEstimate.currency}
                            </strong>
                          </div>
                        </div>
                        <div className="form-row mb-1">
                          <div className="col col-md-3">
                          Cancellation terms
                          </div>
                          <div className="col">
                            <CancellationTerms
                              fees={hotelBookingData.cancellationFees}
                              price={firstRoomEstimate}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="card">
                      <div className="card-body">
                        <h4 className="h4 mb-1">Guest information</h4>
                        <FieldArray
                          name="booking.guestInfo"
                          component={GuestInfoForm}
                        />
                        {errors.booking && errors.booking.guestInfo
                        && touched.booking && touched.booking.guestInfo && (
                        <small className="text-danger ml-1">
                          {errors.booking.guestInfo}
                        </small>
                        )}
                      </div>
                    </div>
                    <div className="card">
                      <div className="card-body">
                        <h4 className="h4 mb-1">Contact</h4>
                        <CustomerForm errors={errors} touched={touched} />
                      </div>
                    </div>
                    <div className="card">
                      <div className="card-body">
                        <div className="form-row mb-1">
                          <div className="form-group col-md-12">
                            <label htmlFor="note">
                              <h4>Do you have something special to say? Leave us a note:</h4>
                            </label>
                            <Field type="text" className="form-control input-lg" name="note" id="note" component="textarea" rows="6" />
                            {errors.note && touched.note && <small className="text-danger">{errors.note}</small>}
                          </div>
                        </div>
                        <div className="col-md-12 text-center">
                          <button type="submit" disabled={isSubmitting} className="btn btn-primary btn-lg">Book this!</button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <HotelInfoBox hotel={hotel} />
                </div>
              </Form>
              )}
            </React.Fragment>
          );
        }}
      </Formik>
    </React.Fragment>
  );
};

BookingForm.defaultProps = {
  error: undefined,
};

BookingForm.propTypes = {
  hotel: PropTypes.instanceOf(Object).isRequired,
  hotelBookingData: PropTypes.instanceOf(Object).isRequired,
  customerData: PropTypes.instanceOf(Object).isRequired,
  guestData: PropTypes.instanceOf(Object).isRequired,
  estimates: PropTypes.instanceOf(Object).isRequired,
  handleBookingFormSubmit: PropTypes.func.isRequired,
  error: PropTypes.string,
};

export default BookingForm;
