import React, { useState, useEffect } from 'react';
import moment from 'moment';
import getSymbolFromCurrency from 'currency-symbol-map';
import useInterval from '../hooks/useInterval';
import { COUNTRIES } from '../helpers';

function CurrentPrice() {
  const localCurrency = localStorage.getItem('BPC_CURRENCY');
  const [price, setPrice] = useState('');
  const [rateDiff, setRateDiff] = useState();
  const [lastUpdated, setLastUpdated] = useState(moment().format('h:mm a'));
  const [currencyValue, setCurrencyValue] = useState(localCurrency ?? 'INR');

  const currencyChange = (selectedCurrency) => {
    localStorage.setItem('BPC_CURRENCY', selectedCurrency);
    setCurrencyValue(selectedCurrency);
    getCurrentPrice(selectedCurrency);
  };

  async function getCurrentPrice(currency = currencyValue) {
    setLastUpdated(moment().format('h:mm a'));
    console.log(
      `%c Fetching New Current Price %c ${lastUpdated}`,
      'color: green; font-weight: bold;',
      'color: white; font-weight: bolder;'
    );
    const response = await fetch(
      `https://api.coindesk.com/v1/bpi/currentprice/${currency}.json`
    );
    const {
      bpi: {
        [currency]: { rate: price, rate_float },
      },
    } = await response.json();
    if (!rateDiff) {
      setRateDiff({
        initial: false,
        display: false,
        oldPrice: rate_float,
        diff: rate_float,
      });
    } else {
      const calcDiff =
        rateDiff.oldPrice >= rate_float
          ? -(rateDiff.oldPrice - rate_float)
          : +(rate_float - rateDiff.oldPrice);
      setRateDiff({
        initial: false,
        display: true,
        oldPrice: rate_float,
        diff: calcDiff.toFixed(2),
      });
    }
    setPrice(price);
  }
  useInterval(() => {
    getCurrentPrice();
  }, 61000);
  useEffect(() => {
    getCurrentPrice();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div className="pt-20 mt-20 d-flex flex-column justify-content-center text-center">
      <select
        className="form-control form-control-sm mx-auto mt-10 w-150 w-sm-200"
        defaultValue={currencyValue}
        onChange={(e) => currencyChange(e.target.value)}
        title="Select Currency"
      >
        {COUNTRIES.map((e) => (
          <option key={e.currency} value={e.currency}>
            {e.country}
          </option>
        ))}
      </select>
      <h1 className="font-size-20 font-weight-bold mb-0">
        1 &#8383; = {getSymbolFromCurrency(currencyValue)} {price}
      </h1>
      <small style={{ marginTop: '3px', marginBottom: '5px' }}>
        <span title="Updates every minute">Last updated at {lastUpdated}</span>
        {rateDiff && rateDiff.display === true ? (
          <span className="ml-10 font-weight-bold">
            Change : {getSymbolFromCurrency(currencyValue)} {rateDiff.diff}
          </span>
        ) : null}
      </small>
    </div>
  );
}

export default CurrentPrice;
