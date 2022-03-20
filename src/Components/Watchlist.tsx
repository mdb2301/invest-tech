import './Watchlist.css'
import { useState } from 'react'
import $ from 'jquery'
import { AreaChart,XAxis,YAxis,Area } from 'recharts'

export default function Watchlist(
    {onClick,data}:
    {
        onClick:Function,
        data:{
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
            history:{
                date: number;
                open: number;
                high: number;
                low: number;
                close: number;
                adjClose: number;
                volume: number;
            }[];
        }[]
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
                            name={el.name}
                            symbol={el.symbol}
                            logo={el.logo}
                            price={el.lastPrice}
                            change={el.changePercent}
                            key={el.symbol}
                            history={el.history}
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
    {name,symbol,logo,price,change,onClick,history}:
    {
        name:string,
        symbol:string,
        logo:string,
        price:number,
        change:number,
        onClick:Function,
        history:{
            date:number;
            open:number;
            high:number;
            close:number;
            low:number;
            adjClose:number;
            volume:number;
        }[];
    }
){
    return <div className="watchlistItem" onClick={()=>onClick()}>
        <div className="watchlistItem-top">
            <div className='company-title'>
                <img src={logo} alt={name} className='companyLogo'/>
                <p style={{marginLeft:'10px'}}>{name}</p>
            </div>
            <div style={{flex:1}}>&nbsp;</div>
            <p style={{fontSize:'10px',color:'rgba(46,46,46,1)'}}>{symbol}</p>
        </div>
        <div className="watchlist-info">
            <div className='price-holder'>
                <p className='price'>{price}</p>
                <p className={"price-change "+(change>0?"green":'red')}>{change+"%"}</p>
            </div>
            <AreaChart
                width={250}
                height={120}
                data={history}
                style={{marginTop:'20px',cursor:'pointer'}}                
                >
                <XAxis dataKey="date" tick={false}/>
                <YAxis dataKey="close" tick={false}/>
                <Area type="monotone" dataKey="close" stroke={change>0?"#03A363":"#FF5353"} fill={change>0?"#7affca":"#ffbaba"} />
            </AreaChart>
        </div>
    </div>
}