import './Watchlist.css'
import green from '../assets/green.svg'
import red from '../assets/red.svg'
import { useState } from 'react'
import $ from 'jquery'


export default function Watchlist(
    {onClick,data}:
    {
        onClick:Function,
        data:{
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
                    $('.watchList').scrollLeft(450)
                }}>
                <i className='bx bx-chevron-right'></i>
            </div>
        </div>
        <div className="watchList">
            {
                data.map((el,i)=>{
                    return <WatchlistItem 
                        name={el.name}
                        symbol={el.symbol}
                        logo={el.logo}
                        price={el.price}
                        change={el.changePercent}
                        key={el.name}
                        onClick={()=>{
                            onClick(i)
                        }}
                    />
                })
            }
        </div>
    </div>
}

function WatchlistItem(
    {name,symbol,logo,price,change,onClick}:
    {name:string,symbol:string,logo:string,price:number,change:number,onClick:Function}
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
            {
                change>0?
                <img src={green} alt="Green" style={{width:'160px',height:'75px',marginLeft:'1rem'}}/>:
                <img src={red} alt="Red" style={{width:'160px',height:'75px',marginLeft:'1rem'}}/>
            }
        </div>
    </div>
}