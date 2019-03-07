const defaultState = {
  results: [],
  sortingScores: [],
};

const reducer = (state = defaultState, action) => {
  switch (action.type) {
    case 'SEARCH_HOTELS_SUCCEEDED':
      return Object.assign({}, state, {
        results: action.payload.items.map(h => h.id),
        sortingScores: action.payload.sortingScores,
      });
    default:
      return state;
  }
};

export default reducer;
