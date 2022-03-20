import './App.css';
import brand from './assets/logos/investTech.svg'
import Watchlist from './Components/Watchlist';
import { useEffect, useState } from 'react';
import StockChart from './Components/StockChart';
import DetailsBox from './Components/DetailsBox';

function App() {

  const [loading,setLoading] = useState(true)
  const [activeIndex,setActiveIndex] = useState(0)
  const [stocks,setStocks] = useState<{
    name: string;
    symbol: string;
    lastPrice: number;
    change: number;
    changePercent: number;
    logo: string;
    open: number;
    previousClose: number;
    dayHigh: number;
    dayLow: number;
    volume: number;
    high52: number;
    low52: number;
    cap: string;
    predictedPrice:number;
    history:{
      date: number;
      open: number;
      high: number;
      low: number;
      close: number;
      adjClose: number;
      volume: number;
  }[];
}[]>([])
  
  useEffect(()=>{
    fetch('http://localhost:5000/stocks-info')
    .then(results => results.json())
    .then((json)=>{          
      setStocks(json.data)
      setActiveIndex(0)
      setLoading(false)
    })
  },[])

  return (
    !loading?    
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
    </div>:
    <div className='loading-holder'>
      <div className="loading">&nbsp;</div>
    </div>
  )
}

export default App;
