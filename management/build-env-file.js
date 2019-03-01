#! /usr/bin/env node

const fs = require('fs');
const path = require('path');

if (process.env.WT_SEARCH_API && process.env.WT_READ_API) {
  fs.writeFileSync(path.resolve(__dirname, '../public/env.js'),
`window.env = {
  WT_SEARCH_API: "${process.env.WT_SEARCH_API}",
  WT_READ_API: "${process.env.WT_READ_API}",
};`);
}
