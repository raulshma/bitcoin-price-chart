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
  async function getPrices() {
    const localData = localStorage.data && JSON.parse(localStorage.data);
    if (
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
    const oldDate = moment(nowDate).subtract(1, 'M').format('yyyy-MM-DD');
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
      ret.push({ year: i, price: bpi[i] });
    }
    setData(ret);
  };
  useEffect(() => {
    getPrices();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <div className="d-flex justify-content-end">
        <div className="custom-switch">
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
