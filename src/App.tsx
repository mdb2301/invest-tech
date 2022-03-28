import './App.css';
import brand from './assets/logos/investTech.svg'
import Watchlist from './Components/Watchlist';
import { useEffect, useState } from 'react';
import StockChart from './Components/StockChart';
import DetailsBox from './Components/DetailsBox';
import Stock, { PredictionData } from './models/Stock';
import { stockInfo } from './assets/stocks'
import bajaj from './outputs/BAJAJAUTO.json'
import infy from './outputs/INFY.json'

function App() {

  const [loading,setLoading] = useState(true)
  const [activeIndex,setActiveIndex] = useState(0)
  const [stocks,setStocks] = useState<Stock[]>([])

  const filemapping = [
    {
      code:"BAJAJAUTO.NS",
      data:bajaj
    },
    {
      code:"INFY.NS",
      data:infy
    }
  ]

  useEffect(()=>{
    var st:Stock[] = []
    stockInfo.forEach((el)=>{
      var stock = Stock.fromJson(el)
      const data = filemapping.find(o=>o.code===stock.code)?.data
      if(data!==undefined){
        data.forEach((e)=>{
          stock.pred_data.push(PredictionData.fromJson(e));
        })
        st.push(stock)  
      }    
    })
    setStocks(st)
    setActiveIndex(0)
    setLoading(false)
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
