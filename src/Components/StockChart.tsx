import './StockChart.css'
import { ResponsiveContainer,AreaChart,XAxis,YAxis,Area,CartesianGrid, Tooltip, TooltipProps, Legend } from 'recharts'
import { NameType, ValueType } from 'recharts/types/component/DefaultTooltipContent'
import { useState } from 'react'
import Stock from '../models/Stock'

export default function StockChart(
    {stock}:
    {stock:Stock}
){
    const pred_price = stock.pred_data[stock.pred_data.length-1].y_pred
    const pred_change = stock.pred_data[stock.pred_data.length-1].y_pred-stock.pred_data[stock.pred_data.length-2].y_pred
    const pred_changePercent = pred_change*100/stock.pred_data[stock.pred_data.length-2].y_pred
    return stock!=null ?
    <div className='stockChart-box'>
        <div className="chart-top">
            <p className='stockchart-name'>{stock.name}&nbsp; <span className='stockchart-symbol'>{stock.code}</span></p>
        </div>
        <div className="price-chart">
            <div className="price-box">
                <p className="price-box-title">Current</p>
                <p className="stockchart-price">{stock.close.toFixed(2)}</p>
                <p className={"stockchart-change "+(stock.change>0?"green":"red")}>{(stock.change>0?"+":"")+stock.change.toFixed(2)+" "+(stock.change>0?"+":"")+stock.changePercent.toFixed(2)+"%"}</p>
            </div>
            <div className="price-box">
                <p className="price-box-title"> <span style={{fontFamily:'Outfit'}}>1</span> -Day Ahead</p>
                <p className="stockchart-price">{pred_price.toFixed(2)}</p>
                <p className={"stockchart-change "+(pred_change>0?"green":"red")}>{(pred_change>0?"+":"")+pred_change.toFixed(2)+" "+(pred_change>0?"+":"")+pred_changePercent.toFixed(2)+"%"}</p>

            </div>
        </div>
        <div style={{height:'30px'}}>&nbsp;</div> 
        
        <ResponsiveContainer width={'95%'} height={280}>
            <AreaChart style={{marginTop:'20px'}} data={stock.pred_data}>
                <XAxis 
                    dataKey="date" 
                    tickCount={4} 
                    type='number' 
                    domain={[stock.pred_data[0].date,stock.pred_data[stock.pred_data.length-1].date]} 
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
                    content={(v)=>{
                        return <CustomTooltip x0={v}/>
                    }}
                />
                <CartesianGrid strokeDasharray="3 4" />
                <Legend 
                    align='center'
                    payload={[
                        {value:"Actual",type:'line',color:stock.change>0?"#03A363":"#FF5353"},
                        {value:"Predicted",type:'line',color:"#1989fa"},
                    ]}
                />
                <Area type="monotone" dataKey="y_test" stroke={stock.change>0?"#03A363":"#FF5353"} fill={stock.change>0?"#7affca":"#ffbaba"} />
                <Area type="monotone" dataKey="y_pred" stroke="#1989fa" fill="transparent" strokeWidth={2}/>
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

const CustomTooltip = ({x0}:{x0:TooltipProps<ValueType, NameType>}) => {
    if (x0.active) {
        const data = x0.payload![0].payload
        const date = new Date(data.date*1000).toDateString()
        return (
            <div className="custom-tooltip">
                <p className="tooltip-date">{date}</p>
                <p className="tooltip-close">{data.close.toFixed(2)}</p>
                <div className="details">
                <p className="key-value">
                    <span className="key">Predicted Price</span>
                    <span className="value">{data.y_pred.toFixed(2)}</span>
                </p>      
                <p className="key-value">
                    <span className="key">Error</span>
                    <span className="value">{(Math.abs(data.y_pred-data.close)*100/data.close).toFixed(2)+"%"}</span>
                </p>           
            </div>
            </div>
        );
    }else{
        return null
    }
  };

