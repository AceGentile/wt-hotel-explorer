import React from 'react';
import PropTypes from 'prop-types';
import ReactMarkdown from 'react-markdown/with-html';
import ScrollAnimation from 'react-animate-on-scroll';

import PillList from '../PillList';
import HotelInfoBox from '../HotelInfoBox';
import RoomTypes from '../RoomTypes';
import GuestForm from '../GuestForm';
import { hotelCategory } from '../../services/enums';
import languageList from '../../assets/language-list.json';

// TODO use cancellationPolicies + defaultCancellationAmount
const HotelDetail = ({
  hotel, estimates, errors, handleGuestFormSubmit, guestFormInitialValues,
  handleBookRoomTypeClicked, handleCancellationFormSubmit,
}) => (
  <React.Fragment>
    <header className="row">
      <div className="col-md-12">

        <div className="text-center">
          <h1 className="mt-1">{hotel.name}</h1>
          <div className="row">
            <div className="col-md-10 mx-auto">
              <ReactMarkdown source={hotel.description} className="hotel-description mb-1" escapeHtml />
            </div>
          </div>
          {(hotel.amenities || hotelCategory[hotel.category] || hotel.spokenLanguages) && (
            <div className="mb-2">
              <PillList list={[hotelCategory[hotel.category]]} className="badge-primary" prefix="Category: " />
              <PillList list={hotel.amenities} />
              <PillList list={hotel.spokenLanguages && hotel.spokenLanguages.map(l => languageList[l])} className="badge-light" prefix="Spoken language:" />
              <PillList list={hotel.tags} className="badge-info" />
            </div>
          )}
        </div>

      </div>
    </header>

    <div className="row">
      <div className="col">
        <GuestForm handleSubmit={handleGuestFormSubmit} initialValues={guestFormInitialValues} />
      </div>
    </div>
    {errors.length > 0 && (
    <div className="row">
      <div className="col-md-12">
        <div className="alert alert-danger">Hotel data is not complete and price estimation might not work as expected.</div>
      </div>
    </div>
    )}

    <div className="row">
      <div className="col-md-12">
        <h3 className="mb-1 h4">Hotel Rooms</h3>
        <div className="row">
          <RoomTypes
            hotel={hotel}
            estimates={estimates}
            onBookRoomTypeClicked={handleBookRoomTypeClicked}
          />
        </div>
      </div>
    </div>

    <ScrollAnimation animateIn="fadeIn" animateOnce className="col">
      <HotelInfoBox hotel={hotel} handleCancellationFormSubmit={handleCancellationFormSubmit} />
    </ScrollAnimation>
  </React.Fragment>
);

HotelDetail.defaultProps = {
  estimates: [],
  errors: [],
};

HotelDetail.propTypes = {
  hotel: PropTypes.instanceOf(Object).isRequired,
  estimates: PropTypes.instanceOf(Array),
  errors: PropTypes.instanceOf(Array),
  handleGuestFormSubmit: PropTypes.func.isRequired,
  handleCancellationFormSubmit: PropTypes.func.isRequired,
  guestFormInitialValues: PropTypes.instanceOf(Object).isRequired,
  handleBookRoomTypeClicked: PropTypes.func.isRequired,
};

export default HotelDetail;
