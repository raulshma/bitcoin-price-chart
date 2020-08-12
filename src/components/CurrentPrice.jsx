import React, { useState, useEffect } from 'react';
import moment from 'moment';

function CurrentPrice() {
  const [price, setPrice] = useState('');
  const [lastUpdated, setLastUpdated] = useState(moment().format('h:mm a'));

  async function getCurrentPrice() {
    const localData = localStorage.current && JSON.parse(localStorage.current);
    if (
      localData &&
      new Date(new Date().toISOString()).getTime() -
        new Date(localData.time.updatedISO).getTime() <
        60000
    ) {
      const {
        INR: { rate: price },
      } = localData.bpi;
      setPrice(price);
      return;
    }
    setLastUpdated(moment().format('h:mm a'));
    console.log(
      `%c Fetching New Current Price %c ${lastUpdated}`,
      'color: green; font-weight: bold;',
      'color: white; font-weight: bolder;'
    );
    const response = await fetch(
      'https://api.coindesk.com/v1/bpi/currentprice/INR.json'
    );
    const data = await response.json();
    localStorage.current = JSON.stringify(data);
    const {
      INR: { rate: price },
    } = data.bpi;
    setPrice(price);
  }
  useEffect(() => {
    getCurrentPrice();
    const id = setTimeout(() => {
      getCurrentPrice();
    }, 61000);
    return () => {
      clearInterval(id);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div className="pt-20 mt-20 d-flex flex-column justify-content-center text-center">
      <h1 className="font-size-20 font-weight-bold mb-0">
        1 &#8383; = &#8377; {price}
      </h1>
      <small style={{ marginTop: '3px' }}>Last updated at {lastUpdated}</small>
    </div>
  );
}

export default CurrentPrice;
