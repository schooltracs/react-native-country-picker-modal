import _ from 'lodash';
import countries from 'world-countries';
import opencc from 'node-opencc';
import flags from '../src/countryFlags';

const isEmoji = process.argv.includes('--emoji');
const isCca2 = process.argv.includes('--cca2');

const getCountryNames = (native, translations) => {
  const ret = {}
  _.forEach(native, ({ common }, key) => {
    ret[key] = common
  })
  _.forEach(translations, ({ common }, key) => {
    ret[key] = common
  })
  // auto convert zho to zht (traditional chinese)
  if (ret.zho) {
    ret['zh-t'] = opencc.simplifiedToTraditional(ret.zho)
  }
  return ret
}

const newcountries = countries
  .map(
    ({ cca2, currency, callingCode, name: { common, native }, translations }) => ({
      [cca2]: {
        currency: currency[0],
        callingCode: callingCode[0],
        flag: isEmoji ? `flag-${cca2.toLowerCase()}` : flags[cca2],
        name: { common, ...getCountryNames(native, translations) },
      },
    })
  )
  .sort((a, b) => {
    if (a[Object.keys(a)[0]].name.common === b[Object.keys(b)[0]].name.common) {
      return 0;
    } else if (a[Object.keys(a)[0]].name.common < b[Object.keys(b)[0]].name.common) {
      return -1;
    }
    return 1;
  })
  .reduce(
    (prev, cur) =>
    ({
      ...prev,
      [Object.keys(cur)[0]]: cur[Object.keys(cur)[0]],
    }),
    {});

if (!isCca2) {
  console.log(JSON.stringify(newcountries)); // eslint-disable-line
} else {
  console.log(JSON.stringify(Object.keys(newcountries))); // eslint-disable-line
}
