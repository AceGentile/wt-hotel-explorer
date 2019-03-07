import React from 'react';
import PropTypes from 'prop-types';

const PillList = ({ list, className, prefix }) => {
  const elementList = list && list.length > 0 && list.filter(x => !!x).map(content => (
    <span key={content} className={`badge badge-pill ${className}`}>
      {prefix}
      {content}
    </span>
  ));
  return elementList && <span>{elementList}</span>;
};

PillList.defaultProps = {
  list: [],
  className: 'badge-secondary',
  prefix: undefined,
};

PillList.propTypes = {
  list: PropTypes.instanceOf(Array),
  className: PropTypes.string,
  prefix: PropTypes.string,
};

export default PillList;
