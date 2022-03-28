import Stock from '../models/Stock'
import './DetailsBox.css'

export default function DetailsBox(
    {stock}:
    {stock:Stock}
){
    return stock!=null?
    <div className="details-box">
        <h3 className='details-title'>Details</h3>
        <div style={{height:'1rem'}}>&nbsp;</div>
        <DetailItem label="Open" value={stock.open.toFixed(2)}/>
        <DetailItem label="Previous Close" value={stock.previousClose.toFixed(2)}/>
        <DetailItem label="Day High" value={stock.dayHigh.toFixed(2)}/>
        <DetailItem label="Day Low" value={stock.dayLow.toFixed(2)}/>
        <DetailItem label="Volume" value={stock.volume.toString()}/>
    </div>:
    <div></div>
}

function DetailItem({label,value}:{label:string,value:string}){
    return <div className='detail-item'>
        <p className='label'>{label}</p>
        <p className='value'>{value}</p>
    </div>
}