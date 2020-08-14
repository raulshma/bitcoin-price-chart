import React, { useState, useEffect } from 'react';
import moment from 'moment';

import {
  ResponsiveContainer,
  LineChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Line,
  Legend,
  BarChart,
  Bar,
  Brush,
  ReferenceLine,
} from 'recharts';

function Graph() {
  const [data, setData] = useState([]);
  const [lineGraph, setLineGraph] = useState(true);

  async function getPrices(num = 7, type = 'days', refresh = false) {
    const localData = localStorage.data && JSON.parse(localStorage.data);
    if (
      refresh === false &&
      localData &&
      new Date(new Date().toISOString()).getTime() -
        new Date(localData.time.updatedISO).getTime() <
        86400000 + 360000
    ) {
      returnData(localData);
      return;
    }
    console.log(
      '%c Fetching New Graph Prices',
      'color: orange; font-weight: bold;'
    );

    const nowDate = moment().format('yyyy-MM-DD');
    const oldDate = moment(nowDate).subtract(num, type).format('yyyy-MM-DD');
    const response = await fetch(
      `https://api.coindesk.com/v1/bpi/historical/INR.json?start=${oldDate}&end=${nowDate}`
    );
    const apidata = await response.json();
    localStorage.data = JSON.stringify(apidata);
    returnData(apidata);
  }

  const returnData = ({ bpi }) => {
    const ret = [];
    for (let i in bpi) {
      ret.push({ year: moment(i).format('MMM DD'), price: bpi[i] });
    }
    setData(ret);
  };

  useEffect(() => {
    getPrices();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <div className="d-flex justify-content-between mb-10">
        <div className="d-flex">
          <div className="custom-radio mr-5 scaleDown">
            <input
              type="radio"
              name="radio-length"
              id="switch-graph-years"
              value="years"
              onChange={() => getPrices(1, 'years', true)}
            />
            <label htmlFor="switch-graph-years">1 Year</label>
          </div>
          <div className="custom-radio mr-5 scaleDown">
            <input
              type="radio"
              name="radio-length"
              id="switch-graph-month"
              value="months"
              onChange={() => getPrices(1, 'months', true)}
            />
            <label htmlFor="switch-graph-month">1 Month</label>
          </div>
          <div className="custom-radio scaleDown">
            <input
              type="radio"
              name="radio-length"
              id="switch-graph-week"
              value="days"
              onChange={() => getPrices(8, 'days', true)}
            />
            <label htmlFor="switch-graph-week">Week</label>
          </div>
        </div>
        <div className="custom-switch scaleDown">
          <input
            type="checkbox"
            id="switch-graph"
            onChange={() => setLineGraph(!lineGraph)}
            value={lineGraph}
          />
          <label htmlFor="switch-graph">Bar Chart</label>
        </div>
      </div>
      <ResponsiveContainer>
        {lineGraph ? (
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="2 2" />
            <XAxis dataKey="year" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="price"
              name="Price"
              stroke="#8884d8"
              activeDot={{ r: 6 }}
            />
          </LineChart>
        ) : (
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="year" />
            <YAxis />
            <Tooltip />
            <Legend verticalAlign="top" wrapperStyle={{ lineHeight: '40px' }} />
            <ReferenceLine y={0} stroke="#000" />
            <Brush dataKey="year" height={20} stroke="#8884d8" />
            <Bar dataKey="price" fill="#8884d8" />
          </BarChart>
        )}
      </ResponsiveContainer>
    </>
  );
}

export default Graph;
