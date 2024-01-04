# js-user-country (Get user's country for Javascript projects.)

[![Dependency Status](https://david-dm.org/vireshshah/js-user-country.svg)](https://david-dm.org/vireshshah/js-cache-tags) [![NPM version](https://badge.fury.io/js/js-user-country.svg)](http://badge.fury.io/js/js-cache-tags) [![Pull requests](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://www.npmjs.com/package/robert) [![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/greeeg/robert/blob/master/LICENSE) 


This library does not use any kind of Geo APIs. Pure browser based solution to detect user's country
based on user's timezone. Detects country from user's timezone in browser.

# Install

```bash
  npm install js-user-country --save
```

Or just include `js-user-country.min.js` file.

# Example

## Initialize:

```js
import getUserCountry from "js-user-country";

console.log(getUserCountry().id); // Prints 'CA'
console.log(getUserCountry().name); // Prints 'Canada'
console.log(getUserCountry().timezones);

/*
Prints:

{
  id: 'CA',
  name: 'Canada',
  timezones: [
    'America/Atikokan',      'America/Blanc-Sablon',
    'America/Cambridge_Bay', 'America/Coral_Harbour',
    'America/Creston',       'America/Dawson',
    'America/Dawson_Creek',  'America/Edmonton',
    'America/Fort_Nelson',   'America/Glace_Bay',
    'America/Goose_Bay',     'America/Halifax',
    'America/Inuvik',        'America/Iqaluit',
    'America/Moncton',       'America/Montreal',
    'America/Nipigon',       'America/Pangnirtung',
    'America/Rainy_River',   'America/Rankin_Inlet',
    'America/Regina',        'America/Resolute',
    'America/St_Johns',      'America/Swift_Current',
    'America/Thunder_Bay',   'America/Toronto',
    'America/Vancouver',     'America/Whitehorse',
    'America/Winnipeg',      'America/Yellowknife'
  ]
}

*/
```

##### Happy Coding! Viresh Shah (http://www.vireshshah.com)
