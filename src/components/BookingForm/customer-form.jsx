import React from 'react';
import PropTypes from 'prop-types';
import {
  Field,
} from 'formik';
import countryList from '../../assets/country-list.json';

const CustomerForm = ({ errors, touched }) => {
  const countries = countryList.map(c => (<option value={c.code} key={c.code}>{c.name}</option>));
  return (
    <React.Fragment>
      <div className="form-row mb-1">
        <div className="col col-form-label required col-md-3">
          <label htmlFor="customer.name">Name</label>
        </div>
        <div className="col">
          <Field
            required
            type="text"
            className={
            `form-control ${
              errors.customer && errors.customer.name && touched.customer && touched.customer.name && 'is-invalid'}`
          }
            name="customer.name"
            id="customer.name"
          />
          {errors.customer && errors.customer.name && touched.customer && touched.customer.name && <small className="text-danger">{errors.customer.name}</small>}
        </div>
      </div>
      <div className="form-row mb-1">
        <div className="col col-form-label required col-md-3">
          <label htmlFor="customer.surname">Surname</label>
        </div>
        <div className="col">
          <Field
            required
            type="text"
            className={
            `form-control ${
              errors.customer && errors.customer.surname && touched.customer && touched.customer.surname && 'is-invalid'}`
          }
            name="customer.surname"
            id="customer.surname"
          />
          {errors.customer && errors.customer.surname && touched.customer && touched.customer.surname && <small className="text-danger">{errors.customer.surname}</small>}
        </div>
      </div>
      <div className="form-row mb-1">
        <div className="col col-form-label required col-md-3">
          <label htmlFor="customer.email">E-mail</label>
        </div>
        <div className="col">
          <Field
            required
            type="text"
            className={
            `form-control ${
              errors.customer && errors.customer.email && touched.customer && touched.customer.email && 'is-invalid'}`
          }
            name="customer.email"
            id="customer.email"
          />
          {errors.customer && errors.customer.email && touched.customer && touched.customer.email && <small className="text-danger">{errors.customer.email}</small>}
        </div>
      </div>
      <div className="form-row mb-1">
        <div className="col col-form-label col-md-3">
          <label htmlFor="customer.phone">Phone</label>
        </div>
        <div className="col">
          <Field
            type="text"
            className={
            `form-control ${
              errors.customer && errors.customer.phone && touched.customer && touched.customer.phone && 'is-invalid'}`
          }
            name="customer.phone"
            id="customer.phone"
          />
          {errors.customer && errors.customer.phone && touched.customer && touched.customer.phone && <small className="text-danger">{errors.customer.phone}</small>}
        </div>
      </div>
      <div className="form-row mb-1">
        <h5>Invoicing address</h5>
      </div>
      <div className="form-row mb-1">
        <div className="col col-form-label required col-md-3">
          <label htmlFor="customer.address.road">Street</label>
        </div>
        <div className="col">
          <Field
            required
            type="text"
            className={
            `form-control ${
              errors.customer && errors.customer.address && errors.customer.address.road && touched.customer && touched.customer.address && touched.customer.address.road && 'is-invalid'}`
          }
            name="customer.address.road"
            id="customer.address.road"
          />
          {errors.customer && errors.customer.address && errors.customer.address.road && touched.customer && touched.customer.address && touched.customer.address.road && <small className="text-danger">{errors.customer.address.road}</small>}
        </div>
      </div>
      <div className="form-row mb-1">
        <div className="col col-form-label required col-md-3">
          <label htmlFor="customer.address.houseNumber">House number</label>
        </div>
        <div className="col">
          <Field
            type="text"
            className={
            `form-control ${
              errors.customer && errors.customer.address && errors.customer.address.houseNumber && touched.customer && touched.customer.address && touched.customer.address.houseNumber && 'is-invalid'}`
          }
            name="customer.address.houseNumber"
            id="customer.address.houseNumber"
          />
          {errors.customer && errors.customer.address && errors.customer.address.houseNumber && touched.customer && touched.customer.address && touched.customer.address.houseNumber && <small className="text-danger">{errors.customer.address.houseNumber}</small>}
        </div>
      </div>
      <div className="form-row mb-1">
        <div className="col col-form-label col-md-3">
          <label htmlFor="customer.address.postcode">Postal code</label>
        </div>
        <div className="col">
          <Field
            type="text"
            className={
            `form-control ${
              errors.customer && errors.customer.address && errors.customer.address.postalCode && touched.customer && touched.customer.address && touched.customer.address.postalCode && 'is-invalid'}`
          }
            name="customer.address.postalCode"
            id="customer.address.postalCode"
          />
          {errors.customer && errors.customer.address && errors.customer.address.postalCode && touched.customer && touched.customer.address && touched.customer.address.postalCode && <small className="text-danger">{errors.customer.address.postalCode}</small>}
        </div>
      </div>
      <div className="form-row mb-1">
        <div className="col col-form-label required col-md-3">
          <label htmlFor="customer.address.city">City</label>
        </div>
        <div className="col">
          <Field
            required
            type="text"
            className={
            `form-control ${
              errors.customer && errors.customer.address && errors.customer.address.city && touched.customer && touched.customer.address && touched.customer.address.city && 'is-invalid'}`
          }
            name="customer.address.city"
            id="customer.address.city"
          />
          {errors.customer && errors.customer.address && errors.customer.address.city && touched.customer && touched.customer.address && touched.customer.address.city && <small className="text-danger">{errors.customer.address.city}</small>}
        </div>
      </div>
      <div className="form-row mb-1">
        <div className="col col-form-label col-md-3">
          <label htmlFor="customer.address.state">State</label>
        </div>
        <div className="col">
          <Field
            type="text"
            className={
            `form-control ${
              errors.customer && errors.customer.address && errors.customer.address.state && touched.customer && touched.customer.address && touched.customer.address.state && 'is-invalid'}`
          }
            name="customer.address.state"
            id="customer.address.state"
          />
          {errors.customer && errors.customer.address && errors.customer.address.state && touched.customer && touched.customer.address && touched.customer.address.state && <small className="text-danger">{errors.customer.address.state}</small>}
        </div>
      </div>
      <div className="form-row mb-1">
        <div className="col col-form-label required col-md-3">
          <label htmlFor="customer.address.countryCode">Country</label>
        </div>
        <div className="col">
          <Field
            required
            component="select"
            className={
            `custom-select form-control ${
              errors.customer && errors.customer.address && errors.customer.address.countryCode && touched.customer && touched.customer.address && touched.customer.address.countryCode && 'is-invalid'}`
          }
            name="customer.address.countryCode"
            id="customer.address.countryCode"
          >
            {countries}
          </Field>
          {errors.customer && errors.customer.address && errors.customer.address.countryCode && touched.customer && touched.customer.address && touched.customer.address.countryCode && <small className="text-danger">{errors.customer.address.countryCode}</small>}
        </div>
      </div>
    </React.Fragment>
  );
};

CustomerForm.propTypes = {
  errors: PropTypes.instanceOf(Object).isRequired,
  touched: PropTypes.instanceOf(Object).isRequired,
};

export default CustomerForm;
