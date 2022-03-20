import './StockChart.css'
import { ResponsiveContainer,AreaChart,XAxis,YAxis,Area,CartesianGrid, Tooltip, TooltipProps } from 'recharts'
import { NameType, ValueType } from 'recharts/types/component/DefaultTooltipContent'
import { useState } from 'react'

export default function StockChart(
    {stock}:
    {stock:{
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
            date:number;
            open:number;
            high:number;
            close:number;
            low:number;
            adjClose:number;
            volume:number;
        }[]
    }}
){
    const [showDetails,toggleDetails] = useState(false)
    return stock!=null ?
    <div className='stockChart-box'>
        <div className="chart-top">
            <p className='stockchart-name'>{stock.name}&nbsp; <span className='stockchart-symbol'>{stock.symbol}</span></p>
        </div>
        <div className="price-chart">
            <div className="price-box">
                <p className="price-box-title">Current</p>
                <p className="stockchart-price">{stock.lastPrice}</p>
                <p className={"stockchart-change "+(stock.change>0?"green":"red")}>{(stock.change>0?"+":"")+stock.change+" "+(stock.change>0?"+":"")+stock.changePercent}</p>
            </div>
            <div className="price-box">
                <p className="price-box-title"> <span style={{fontFamily:'Outfit'}}>1</span> -Day Ahead</p>
                <p className="stockchart-price">{stock.lastPrice}</p>
                <p className={"stockchart-change "+(stock.change>0?"green":"red")}>{(stock.change>0?"+":"")+stock.change+" "+(stock.change>0?"+":"")+stock.changePercent+"%"}</p>

            </div>
        </div>
        <div style={{height:'30px'}}>&nbsp;</div> 
        <div style={{alignSelf:'flex-end'}}>
            <input style={{marginInline:'5px'}} type="checkbox" name="check" checked={showDetails} onClick={()=>toggleDetails(!showDetails)}/>
            <label htmlFor="check">Show Details</label>
        </div>
        <ResponsiveContainer width={'95%'} height={280}>
            <AreaChart data={stock.history} style={{marginTop:'20px'}}>
                <XAxis 
                    dataKey="date" 
                    tickCount={4} 
                    type='number' 
                    domain={[stock.history[0].date,stock.history[99].date]} 
                    tickFormatter={(v)=>{
                        const d = new Date(v*1000)
                        return d.toDateString()
                    }}
                    style={{fontSize:'0.7em'}}                    
                />
                <YAxis 
                    dataKey="close" 
                    tickCount={3} 
                    type='number'
                    style={{fontSize:'0.7em'}}
                />
                <Tooltip
                    cursor={<CustomCursor/>}                    
                    content={(v)=><CustomTooltip x0={v} showDetails={showDetails}/>}
                />
                <CartesianGrid strokeDasharray="3 4" />
                <Area type="monotone" dataKey="close" stroke={stock.change>0?"#03A363":"#FF5353"} fill={stock.change>0?"#7affca":"#ffbaba"} />
            </AreaChart>      
        </ResponsiveContainer>  
        <div style={{height:'30px'}}>&nbsp;</div>     
    </div>:
    <div></div>
}

function CustomCursor(){
    return <div style={{border:'1px solid var(--primary-color)',borderRadius:'50%',background:'white',width:'5px',height:'5px'}}>
        &nbsp;
    </div>
}

const CustomTooltip = ({
    x0,showDetails
  }: {x0:TooltipProps<ValueType, NameType>,showDetails:boolean}) => {
    const active = x0.active
    const payload = x0.payload
    if (active) {
        const data = payload![0].payload
        const date = new Date(data['date']*1000).toDateString()
        return (
            <div className="custom-tooltip">
                <p className="tooltip-date">{date}</p>
                <p className="tooltip-close">{data['close']}</p>
                {
                    showDetails ? 
                    <div className="details">
                        <p className="key-value">
                            <span className="key">Open</span>
                            <span className="value">{data['open'].toFixed(2)}</span>
                        </p>
                        <p className="key-value">
                            <span className="key">High</span>
                            <span className="value">{data['high'].toFixed(2)}</span>
                        </p>
                        <p className="key-value">
                            <span className="key">Low</span>
                            <span className="value">{data['low'].toFixed(2)}</span>
                        </p>
                        <p className="key-value">
                            <span className="key">Adj Close</span>
                            <span className="value">{data['adjClose'].toFixed(2)}</span>
                        </p>
                        <p className="key-value">
                            <span className="key">Volume</span>
                            <span className="value">{data['volume']}</span>
                        </p>
                    </div>:<div></div>
                }
            </div>
        );
    }
  
    return null;
  };

