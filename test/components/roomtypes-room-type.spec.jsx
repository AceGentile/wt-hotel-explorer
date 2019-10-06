import React from 'react';
import { shallow } from 'enzyme';

import { QuantityBadge, AvailabilityBadge } from '../../src/components/RoomTypes/badges';
import PillList from '../../src/components/PillList';
import RoomType, { BookRoomButton } from '../../src/components/RoomTypes/room-type';


describe('BookRoomButton', () => {
  const baseProps = {
    hotelId: 'hotel-id',
    roomTypeId: 'room-type-id',
    onBookRoomTypeClicked: () => { },
  };

  it('should display a "Book this room!" button', () => {
    const component = shallow(<BookRoomButton {...baseProps} />);
    expect(component.find('button').props().children).toBe('Book this room!');
  });

  it('"Book this room!" button click should call onBookRoomTypeClicked', () => {
    const props = { ...baseProps, onBookRoomTypeClicked: jest.fn() };
    const component = shallow(<BookRoomButton {...props} />);
    component.find('button').simulate('click');
    expect(props.onBookRoomTypeClicked).toHaveBeenCalledWith({
      hotelId: 'hotel-id',
      roomTypeId: 'room-type-id',
    });
  });
});


describe('RoomType', () => {
  const baseProps = {
    hotel: {
      bookingUri: 'http://example.com',
      id: 'hotel-id',
    },
    roomType: {
      amenities: ['amenity1', 'amenity2'],
      id: 'room-type-id',
      images: ['image1.png', 'image2.png'],
      category: 'duplex',
    },
    estimate: {
      price: {
        format: () => ('formatted'),
      },
      currency: 'EUR',
      quantity: 2,
    },
    index: 100,
    onBookRoomTypeClicked: () => { },
  };

  it('full info provided', () => {
    const component = shallow(<RoomType {...baseProps} />);
    expect(component.find(QuantityBadge)).toHaveLength(1);
    expect(component.find(AvailabilityBadge)).toHaveLength(1);
    expect(component.find(BookRoomButton)).toHaveLength(1);
    expect(component.find(PillList)).toHaveLength(2);
  });

  it('no roomType.amenities and no roomType.category provided', () => {
    const props = {
      ...baseProps,
      roomType: {
        ...baseProps.roomType,
        amenities: undefined,
        category: undefined,
      },
    };
    const component = shallow(<RoomType {...props} />);
    expect(component.find(QuantityBadge)).toHaveLength(1);
    expect(component.find(AvailabilityBadge)).toHaveLength(1);
    expect(component.find(BookRoomButton)).toHaveLength(1);
    expect(component.find(PillList)).toHaveLength(0);
  });

  it('no hotel.bookingUri provided', () => {
    const props = {
      ...baseProps,
      hotel: {
        ...baseProps.hotel,
        bookingUri: undefined,
      },
    };
    const component = shallow(<RoomType {...props} />);
    expect(component.find(QuantityBadge)).toHaveLength(1);
    expect(component.find(AvailabilityBadge)).toHaveLength(1);
    expect(component.find(BookRoomButton)).toHaveLength(0);
    expect(component.find(PillList)).toHaveLength(2);
  });

  it('no estimate.price provided', () => {
    const props = {
      ...baseProps,
      estimate: {
        ...baseProps.estimate,
        price: undefined,
      },
    };
    const component = shallow(<RoomType {...props} />);
    expect(component.find(QuantityBadge)).toHaveLength(0);
    expect(component.find(AvailabilityBadge)).toHaveLength(0);
    expect(component.find(BookRoomButton)).toHaveLength(0);
    expect(component.find(PillList)).toHaveLength(2);
  });

  it('AvailabilityBadge', () => {
    const props = { ...baseProps, onBookRoomTypeClicked: jest.fn() };
    const spy = jest.spyOn(baseProps.estimate.price, 'format');
    const component = shallow(<RoomType {...props} />);

    expect(component.find(AvailabilityBadge).dive().props().children)
      .toEqual([
        <i className="mdi mdi-calendar mdi-18px text-muted" />,
        ' ',
        <strong className="text--accent">
          Available from
          {' '}
          <span className="font--alt">formatted</span>
          {' '}
          EUR
        </strong>,
      ]);
    expect(spy).toHaveBeenCalledWith();
  });

  it('QuantityBadge', () => {
    const component = shallow(<RoomType {...baseProps} />);

    expect(component.find(QuantityBadge).dive().props().children)
      .toEqual([
        <i className="mdi mdi-alert-octagram text-warning" />,
        ' ',
        <em>
          Last
          {' '}
          {2}
          {' '}
          remaining!
        </em>,
      ]);
  });

  it('PillList', () => {
    const component = shallow(<RoomType {...baseProps} />);

    // categories
    expect(
      component.find(PillList).at(0).dive().find('span > span')
        .props().children,
    ).toEqual(['Category: ', 'Duplex']);

    // amenities
    expect(
      component.find(PillList)
        .at(1).dive().find('span > span')
        .at(0)
        .props().children,
    ).toEqual([undefined, 'amenity1']);
    expect(
      component.find(PillList)
        .at(1).dive().find('span > span')
        .at(1)
        .props().children,
    ).toEqual([undefined, 'amenity2']);
  });

  it('BookRoomButton', () => {
    const props = { ...baseProps, onBookRoomTypeClicked: jest.fn() };
    const component = shallow(<RoomType {...props} />);
    expect(component.find(BookRoomButton)).toHaveLength(1);

    component.find(BookRoomButton).dive().find('button').simulate('click');
    expect(props.onBookRoomTypeClicked).toHaveBeenCalledWith({
      hotelId: 'hotel-id',
      roomTypeId: 'room-type-id',
    });
  });

  it('selected image is roomType.images[0]', () => {
    const component = shallow(<RoomType {...baseProps} />);
    expect(component.find('img').props()).toEqual({
      alt: 'image1.png',
      src: 'image1.png',
    });
  });

  it('selected image is imagePlaceholder if roomTypes.images.length === 0', () => {
    const props = {
      ...baseProps,
      onBookRoomTypeClicked: jest.fn(),
      roomType: {
        ...baseProps.roomType,
        images: [],
      },
    };
    const component = shallow(<RoomType {...props} />);
    expect(component.find('img').props()).toEqual({
      alt: 'FILE_MOCK',
      src: 'FILE_MOCK',
    });
  });
});
