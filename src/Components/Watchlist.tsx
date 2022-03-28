import './Watchlist.css'
import { useState } from 'react'
import $ from 'jquery'
import { AreaChart,XAxis,YAxis,Area } from 'recharts'
import Stock from '../models/Stock'

export default function Watchlist(
    {onClick,data}:
    {
        onClick:Function,
        data:Stock[]
    }
){

    const [showNext,toggleShowNext] = useState(true)
    const [showPrev,toggleShowPrev] = useState(false)

    return <div className="watchlist-holder">
        <div className="prev-holder" style={{display:showPrev?'flex':'none'}}>
            <div className="prev" onClick={()=>{
                toggleShowNext(true)
                toggleShowPrev(false)
                $('.watchList').scrollLeft(0)
            }}>
                <i className='bx bx-chevron-left'></i>
            </div>
        </div>
        
        <div className="next-holder" style={{display:showNext?'flex':'none'}}>
            <div className="next" onClick={()=>{
                    toggleShowNext(false)
                    toggleShowPrev(true)
                    $('.watchList').scrollLeft(800)
                }}>
                <i className='bx bx-chevron-right'></i>
            </div>
        </div>
        {
            data!=null ?
            <div className="watchList">
                {
                    data.map((el,i)=>{
                        return <WatchlistItem 
                            stock={el}
                            key={el.code}
                            onClick={()=>{
                                onClick(i)
                            }}
                        />
                    })
                }
            </div>:
            <div></div>
        }
    </div>
}

function WatchlistItem(
    {stock,onClick}:
    {
        onClick:Function,
        stock:Stock
    }
){
    return <div className="watchlistItem" onClick={()=>onClick()}>
        <div className="watchlistItem-top">
            <div className='company-title'>
                <img src={stock.logo} alt={stock.name} className='companyLogo'/>
                <p style={{marginLeft:'10px'}}>{stock.name}</p>
            </div>
            <div style={{flex:1}}>&nbsp;</div>
            <p style={{fontSize:'10px',color:'rgba(46,46,46,1)'}}>{stock.code}</p>
        </div>
        <div className="watchlist-info">
            <div className='price-holder'>
                <p className='price'>{stock.close.toFixed(2)}</p>
                <p className={"price-change "+(stock.change>0?"green":'red')}>{stock.change.toFixed(2)+"%"}</p>
            </div>
            <AreaChart
                width={250}
                height={120}
                data={stock.pred_data}
                style={{marginTop:'20px',cursor:'pointer'}}                
                >
                <XAxis dataKey="date" tick={false}/>
                <YAxis dataKey="close" tick={false}/>
                <Area type="monotone" dataKey="y_test" stroke={stock.change>0?"#03A363":"#FF5353"} fill={stock.change>0?"#7affca":"#ffbaba"} />
                <Area type="monotone" dataKey="y_pred" stroke="#1989fa" fill="transparent" />
            </AreaChart>
        </div>
    </div>
}