import './DetailsBox.css'

export default function DetailsBox(
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
    return <div className="details-box">
        <h3 className='details-title'>Details</h3>
        <div style={{height:'1rem;'}}>&nbsp;</div>
        <DetailItem label="Open" value={stock.open.toString()}/>
        <DetailItem label="Previous Close" value={stock.previousClose.toString()}/>
        <DetailItem label="Day High" value={stock.dayHigh.toString()}/>
        <DetailItem label="Day Low" value={stock.dayLow.toString()}/>
        <DetailItem label="Volume" value={stock.volume.toString()}/>
        <DetailItem label="52-week High" value={stock.high52.toString()}/>
        <DetailItem label="52-week Low" value={stock.low52.toString()}/>
        <DetailItem label="Market Cap" value={stock.cap}/>
    </div>
}

function DetailItem({label,value}:{label:string,value:string}){
    return <div className='detail-item'>
        <p className='label'>{label}</p>
        <p className='value'>{value}</p>
    </div>
}