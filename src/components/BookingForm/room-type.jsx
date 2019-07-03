import React from 'react';
import PropTypes from 'prop-types';
import ReactMarkdown from 'react-markdown/with-html';
import PillList from '../PillList';
import RoomTypeImageModal from '../RoomTypeImageModal';
import imagePlaceholder from '../../assets/img/placeholder.png';

class RoomType extends React.PureComponent {
  render() {
    const {
      roomType,
    } = this.props;

    const selectedImage = (roomType.images && roomType.images.length)
      ? roomType.images[0]
      : imagePlaceholder;
    return (
      <React.Fragment>
        <div className="row d-flex">
          <div className="col-sm-12 col-lg-6 d-flex">
            <button className="card-img-top area-btn" type="button" data-toggle="modal" data-target="#roomModal-1">
              <div className="img-crop" style={{ backgroundImage: `URL(${selectedImage})` }}>
                <img src={selectedImage} alt={selectedImage} />
              </div>
              <div className="area-btn__btn">
                <i className="mdi mdi-18px text-white mdi-arrow-expand" />
                <span className="d-none">View Photos</span>
              </div>
            </button>
          </div>
          <div className="col-sm-12 col-lg-6 d-flex">
            <div className="pt-1 text-muted">
              <h5 className="card-title h5">{roomType.name}</h5>
              <ReactMarkdown className="card-text text--weight-normal" source={roomType.description} escapeHtml />
              <PillList list={roomType.amenities} />
            </div>
          </div>

        </div>
        <RoomTypeImageModal roomType={roomType} />
      </React.Fragment>
    );
  }
}

RoomType.propTypes = {
  roomType: PropTypes.instanceOf(Object).isRequired,
};

export default RoomType;
