import React, { useState, useEffect } from 'react';
import useInterval from '../hooks/useInterval';
import moment from 'moment';

function CurrentPrice() {
  const [price, setPrice] = useState('');
  const [rateDiff, setRateDiff] = useState();
  const [lastUpdated, setLastUpdated] = useState(moment().format('h:mm a'));

  async function getCurrentPrice() {
    setLastUpdated(moment().format('h:mm a'));
    console.log(
      `%c Fetching New Current Price %c ${lastUpdated}`,
      'color: green; font-weight: bold;',
      'color: white; font-weight: bolder;'
    );
    const response = await fetch(
      'https://api.coindesk.com/v1/bpi/currentprice/INR.json'
    );
    const {
      bpi: {
        INR: { rate: price, rate_float },
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
      <h1 className="font-size-20 font-weight-bold mb-0">
        1 &#8383; = &#8377; {price}
      </h1>
      <small style={{ marginTop: '3px' }}>
        <span title="Updates every minute">Last updated at {lastUpdated}</span>
        {rateDiff && rateDiff.display === true ? (
          <span className="ml-10 font-weight-bold">
            Change : &#8377; {rateDiff.diff}
          </span>
        ) : null}
      </small>
    </div>
  );
}

export default CurrentPrice;
