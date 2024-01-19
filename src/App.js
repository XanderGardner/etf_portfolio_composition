import React, { useState, useEffect } from "react";

// fetch csv etf data and return array of arrays with ticker, percent
const fetchData = async (path) => {
  try {
    const response = await fetch(process.env.PUBLIC_URL + path);
    if (!response.ok) {
      throw new Error(`Failed to fetch CSV: ${response.status} ${response.statusText}`);
    }

    const responseData = await response.text();
    let data = responseData.split(/\r?\n/).map(row => row.split(','));
    return data.map(row => [row[0], parseFloat(row[1])])
  } catch (error) {
    console.error("Error fetching CSV data:", error);
    return [];
  }
};

// main app
export default function App() {
  
  // load data asynchronously
  // using states for csv data loaded with effect
  const loadData = async () => {
    const etf_djd = await fetchData("/assets/etf_data/djd.csv");
    const etf_qqq = await fetchData("/assets/etf_data/qqq.csv");
    const etf_vgt = await fetchData("/assets/etf_data/vgt.csv");
    const etf_voo = await fetchData("/assets/etf_data/voo.csv");

    set_etf_djd(etf_djd)
    set_etf_qqq(etf_qqq)
    set_etf_vgt(etf_vgt)
    set_etf_voo(etf_voo)

    console.log(etf_djd)
};
  useEffect(() => {
    loadData();
  }, []);
  const [etf_djd, set_etf_djd] = useState([])
  const [etf_qqq, set_etf_qqq] = useState([])
  const [etf_vgt, set_etf_vgt] = useState([])
  const [etf_voo, set_etf_voo] = useState([])
  
  // states for percent in each index
  const [djdPercent, setDjdPercent] = useState(0.0);
  const [qqqPercent, setQqqPercent] = useState(0.0);
  const [vgtPercent, setVgtPercent] = useState(0.0);
  const [vooPercent, setVooPercent] = useState(0.0);
  const totEtfPercent = djdPercent + qqqPercent + vooPercent + vgtPercent
  const usdPercent = 100.0 - totEtfPercent;
  
  // handle sliders changing the state
  function handleSlideChange(etf, nextPercent) {
    if (etf === "djd") {
      setDjdPercent(nextPercent);
    } else if (etf === "qqq") {
      setQqqPercent(nextPercent);
    } else if (etf === "vgt") {
      setVgtPercent(nextPercent);
    } else if (etf === "voo") {
      setVooPercent(nextPercent);
    }
  }

  
  const stock_compositions = etf_djd;

  return (
    <div className="centerspace">
    <div className="flexhorz">

      <div className="flexvert">
        <h1>Select Allocation</h1>
        <Allocator percent={usdPercent.toFixed(1)} maxPercent={usdPercent.toFixed(1)} etf_name="usd" index_name="USD" onSlideChange={handleSlideChange}/>
        <Allocator percent={djdPercent} maxPercent={100.0-totEtfPercent+djdPercent} etf_name="djd" index_name="Dow Jones Industrial Average" onSlideChange={handleSlideChange}/>
        <Allocator percent={qqqPercent} maxPercent={100.0-totEtfPercent+qqqPercent} etf_name="qqq" index_name="Nasdaq-100 Index" onSlideChange={handleSlideChange}/>
        <Allocator percent={vooPercent} maxPercent={100.0-totEtfPercent+vooPercent} etf_name="voo" index_name="S&P 500" onSlideChange={handleSlideChange}/>
        <Allocator percent={vgtPercent} maxPercent={100.0-totEtfPercent+vgtPercent} etf_name="vgt" index_name="Vanguard Information Technology" onSlideChange={handleSlideChange}/>
      </div>

      <div className="flexvert">
        <h1>Portfolio Composition</h1>

        <div className="scrollvert">
          {
            stock_compositions.map((stock) => 
              <Stock key={stock[0]} ticker={stock[0]} percent={stock[1]} />
            )
          }
        </div>

      </div>

    </div>
    </div>
    
    
  )
}

// component for each etf to select
function Allocator( {etf_name, index_name, percent, maxPercent, onSlideChange} ) {
  // for max slider limits
  const sliderStyle = {
    width: `${maxPercent}px`,
    maxWidth: '110px',
  };
  const sliderContainer = {
    width: '130px'
  };
  
  return (
    <div className="fixedhorz">
      <div className="allocatoretf">
        <h2>{index_name}</h2>
      </div>
      <div style={sliderContainer}>
      <input
        type="range" 
        min="0.0" max={maxPercent} step="0.1"
        value={percent} 
        onChange={(e) => onSlideChange(etf_name, parseFloat(e.target.value))}
        disabled={false}
        style={sliderStyle}
      />
      </div>
      <div className="percenttext">{percent}%</div>
    </div>
  );
}

// component for each stock in portfolio
function Stock( {ticker, percent} ) {
  return (
    <div className="flexhorztext">
      <div className="percenttext">
       {ticker}
      </div>
      <div className="percenttext">
      {percent}%
      </div>
    </div>
  );
}