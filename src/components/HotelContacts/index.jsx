import React from 'react';
import PropTypes from 'prop-types';

// TODO incorporate most common additional contacts #22
const Contact = ({ contact }) => {
  const additionalContacts = contact.additionalContacts && contact.additionalContacts.map(c => (
    <li key={c.title}>
      <strong>{c.title}</strong>
:
      {' '}
      {c.value}
    </li>
  ));
  return (
    <ul className="list-unstyled">
      {contact.email && (
      <li>
        <i className="mdi mdi-email" />
        {' '}
        <a href={`mailto:${contact.email}`}>{contact.email}</a>
      </li>
      )}
      {contact.phone && (
      <li>
        <i className="mdi mdi-phone" />
        {' '}
        <a href={`tel:${contact.phone}`}>{contact.phone}</a>
      </li>
      )}
      {contact.url && (
      <li>
        <i className="mdi mdi-web" />
        {' '}
        <a href={contact.url} target="_blank" rel="noopener noreferrer">{contact.url}</a>
      </li>
      )}
      {additionalContacts && <li><ul>{additionalContacts}</ul></li>}
    </ul>
  );
};

Contact.propTypes = {
  contact: PropTypes.instanceOf(Object).isRequired,
};

const HotelContacts = ({ contacts }) => (
  <div>
    <Contact contact={contacts.general} />
  </div>
);

HotelContacts.propTypes = {
  contacts: PropTypes.instanceOf(Object).isRequired,
};

export default HotelContacts;

export {
  Contact,
  HotelContacts,
};
