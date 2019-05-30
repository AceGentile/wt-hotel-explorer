// This file should never be part of a webpack build.
// It is loaded before the whole app and serves as a
// runtime config.
//
// The motivation is to have only a single docker image
// build that is populated with env-specific configuration
// during container startup.
window.env = {
  WT_SEARCH_API: 'https://playground-search-api.windingtree.com',
  WT_READ_API: 'https://playground-api.windingtree.com',
  WT_SIGN_BOOKING_REQUESTS: false,
  ETH_NETWORK_PROVIDER: 'https://ropsten.infura.io/v3/def1927234dd483c84e21d35d0e36a95',
};
