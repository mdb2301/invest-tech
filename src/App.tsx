import './App.css';
import brand from './assets/logos/investTech.svg'
import Watchlist from './Components/Watchlist';
import { stocks } from './assets/stocks'
import { useState } from 'react';
import StockChart from './Components/StockChart';
import DetailsBox from './Components/DetailsBox';

function App() {
  const [activeIndex,setActiveIndex] = useState(0)
  return (
    <div style={{backgroundColor:'var(--bg-color)',display:'flex',flexDirection:'column'}}>
      <div className='top-bar'>
        <img src={brand} alt="InvestTech" style={{height:'1.2rem'}}/>
        <button className="join-button">
          Join Us
        </button>
      </div>
      <Watchlist data={stocks} onClick={setActiveIndex}/>
      <div style={{display:'flex',alignItems:'center',justifyContent:'center'}}>
        <StockChart stock={stocks[activeIndex]}/>
        <DetailsBox stock={stocks[activeIndex]}/>
      </div>
    </div>
  );
}

export default App;
