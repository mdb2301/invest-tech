import { useEffect, useState } from 'react'
import './StockChart.css'
import chart from '../assets/chart.svg'

export default function StockChart(
    {stock}:
    {stock:{
        name: string;
        symbol: string;
        price: number;
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
    }}
){
    const [time,setTime] = useState(new Date(Date.now()))

    useEffect(()=>{
        const timerId = setInterval(() => setTime(new Date(Date.now())), 1000);
        return () => clearInterval(timerId);
    })

    return <div className='stockChart-box'>
        <div className="chart-top">
            <div className="chart-info">
                <p className='stockchart-name'>{stock.name}&nbsp; <span className='stockchart-symbol'>{stock.symbol}</span></p>
                <p className="stockchart-price">{stock.price}&nbsp; <span className={'stockchart-change '+(stock.change>0?"green":"red")}>{(stock.change>0?"+":"")+stock.change +" " + (stock.changePercent>0?"+":"")+stock.changePercent+"%"}</span><span className="predicted-price">{stock.predictedPrice}</span></p>                
            </div>
            <DateTime time={time}/>
        </div>
        <img src={chart} alt="Chart" style={{width:'600px',margin:'2rem 0'}}/>  
        <div style={{display:'flex',alignItems:'center',justifyContent:'flex-start'}}>
            <div className="square black">&nbsp;</div> Current Price 
            <div style={{width:'15px'}}>&nbsp;</div>
            <div className="square blue">&nbsp;</div> Predicted Price   
        </div>        
    </div>
}

function DateTime({time}:{time:Date}){
    const months = ["January","February","March","April","May","June","July","August","September","October","November","December"]
    return <p className="datetime">
        {months[time.getMonth()] +" "+ time.getDate() +" "+ (time.getHours()>12? time.getHours()%12<10?"0"+time.getHours()%12 :time.getHours()%12 :time.getHours())+":"+time.getMinutes() + " "+ (time.getHours()>12?"PM":"AM") +" IST"}
    </p>
}