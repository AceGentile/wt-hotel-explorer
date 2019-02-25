import { createActionThunk } from 'redux-thunk-actions';

import {
  HttpError,
  Http404Error,
  HttpBadRequestError,
  HttpInternalServerError,
} from '../services/errors';

export const translateNetworkError = (status, code, message) => {
  if (status === 400) {
    return new HttpBadRequestError(code, message);
  }
  if (status === 404) {
    return new Http404Error(code, message);
  }
  if (status === 500) {
    return new HttpInternalServerError(code, message);
  }
  const e = new HttpError(code, message);
  e.status = status;
  return e;
};

const paginatedFetchSearchResults = url => fetch(url)
  .then((r) => {
    if (r.status > 299) {
      throw translateNetworkError(r.status, r.code, r.message);
    }
    return r.json();
  }).then((data) => {
    if (data.next) {
      return paginatedFetchSearchResults(data.next)
        .then(s => ({
          items: data.items ? data.items.concat(s.items) : s.items,
          sortingScores: data.sortingScores
            ? data.sortingScores.concat(s.sortingScores)
            : s.sortingScores,
        }));
    }
    return data;
  });

export const byAttributes = createActionThunk('SEARCH_HOTELS', ({ centerCoords, bboxSide, category }) => {
  const attrs = [];
  if (category) {
    attrs.category = category;
  }
  if (centerCoords && bboxSide) {
    attrs.location = `${centerCoords[0]},${centerCoords[1]}:${bboxSide}`;
  }
  if (centerCoords) {
    attrs.sortByDistance = `${centerCoords[0]},${centerCoords[1]}`;
  }
  const joinedAttrs = Object.keys(attrs)
    .map(k => `${k}=${attrs[k]}`)
    .join('&');
  const url = `${window.env.WT_SEARCH_API}/hotels/?${joinedAttrs}`;
  return paginatedFetchSearchResults(url);
});

export default {
  byAttributes,
};
