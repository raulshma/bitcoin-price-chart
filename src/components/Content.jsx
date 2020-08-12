import React from 'react';
import Graph from './Graph';
import CurrentPrice from './CurrentPrice';

const styles = { height: '77vh', paddingLeft: 0 };

function Content() {
  return (
    <div className="container p-10 d-flex flex-column justify-content-center">
      <CurrentPrice />
      <div className="container" style={styles}>
        <Graph />
      </div>
    </div>
  );
}

export default Content;
