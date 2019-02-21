const https = require('https')
  path = require('path'),
  fs = require('fs');

https.get('https://restcountries.eu/rest/v2/all', (resp) => {
  let data = '';

  // A chunk of data has been recieved.
  resp.on('data', (chunk) => {
    data += chunk;
  });

  // The whole response has been received. Print out the result.
  resp.on('end', () => {
    const parsed = JSON.parse(data);
    const countryList = parsed.map((c) => {
      return {
        name: c.name,
        code: c.alpha2Code,
      };
    }).sort((a, b) => {
      return a.name < b.name ? -1 : 1;
    });
    countryList.unshift({ name: '--', code: '' });
    fs.writeFileSync(path.resolve(__dirname, '../src/assets/country-list.json'), JSON.stringify(countryList));
  });
});

https.get('https://gist.githubusercontent.com/JirkaChadima/d55008d34ac9bf5cf53488240969c3f9/raw/8d53db31fbdf9a757133d1470eee8446f043ad4d/ISO-639-1-language.json', (resp) => {
  let data = '';

  // A chunk of data has been recieved.
  resp.on('data', (chunk) => {
    data += chunk;
  });

  // The whole response has been received. Print out the result.
  resp.on('end', () => {
    const parsed = JSON.parse(data);
    const languageList = {};
    for (let i = 0; i < parsed.length; i++) {
      if (parsed[i].code) {
        languageList[parsed[i].code] = parsed[i].name;
      }
    }
    fs.writeFileSync(path.resolve(__dirname, '../src/assets/language-list.json'), JSON.stringify(languageList));
  });
});