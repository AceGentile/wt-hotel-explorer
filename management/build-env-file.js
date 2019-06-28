#! /usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log(`WT_SEARCH_API: ${process.env.WT_SEARCH_API}`);
console.log(`WT_READ_API: ${process.env.WT_READ_API}`);
console.log(`ETH_NETWORK_PROVIDER: ${process.env.ETH_NETWORK_PROVIDER}`);

if (process.env.WT_SEARCH_API && process.env.WT_READ_API && process.env.ETH_NETWORK_PROVIDER) {
  fs.writeFileSync(path.resolve(__dirname, '../public/env.js'),
`window.env = {
  WT_SEARCH_API: "${process.env.WT_SEARCH_API}",
  WT_READ_API: "${process.env.WT_READ_API}",
  WT_SIGN_BOOKING_REQUESTS: "${process.env.WT_SIGN_BOOKING_REQUESTS || 'false'}",
  ETH_NETWORK_PROVIDER: "${process.env.ETH_NETWORK_PROVIDER}",
};`);
}
