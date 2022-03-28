export default class Stock{
    code:string;
    name:string;
    change:number;
    changePercent:number;
    dayHigh:number;
    dayLow:number;
    open:number;
    close:number;
    volume:number;
    previousClose:number;
    logo:string;
    pred_data:PredictionData[];
    lastDate:string

    constructor(    
        {code,name,dayHigh,dayLow,open,close,volume,previousClose,logo,pred_data,lastDate}:
        {code:string,name:string,dayHigh:number,dayLow:number,open:number,close:number,volume:number,previousClose:number,logo:string,pred_data:PredictionData[],lastDate:string}    
    ){
        this.code = code;
        this.name = name;
        this.change = close - previousClose;
        this.changePercent = (close - previousClose)*100/previousClose;
        this.dayHigh = dayHigh;
        this.dayLow = dayLow;
        this.open = open;
        this.close = close;
        this.volume = volume;
        this.previousClose = previousClose;
        this.logo = logo;
        this.pred_data = pred_data;
        this.lastDate = lastDate;
    }

    static empty(){
        return new Stock({code:"",name:"",dayHigh:-1,dayLow:-1,open:-1,close:-1,volume:-1,previousClose:-1,logo:"",pred_data:[],lastDate:""})
    }

    static fromJson(
        json:{
            code:string;
            name:string;
            dayHigh:number;
            dayLow:number;
            open:number;
            close:number;
            volume:number;
            previousClose:number;
            logo:string;
            pred_data:{
                open:number;high:number;low:number;close:number;volume:number;y_test:number;y_pred:number;
            }[];
            lastDate:string;
        }
    ){
        var d:PredictionData[] = []
        json.pred_data!.forEach((el:any)=>{
            d.push(PredictionData.fromJson(el))
        })
        return new Stock({code:json.code,name:json.name,dayHigh:json.dayHigh,dayLow:json.dayLow,open:json.open,close:json.close,volume:json.volume,previousClose:json.previousClose,logo:json.logo,pred_data:d,lastDate:json.lastDate});
    }
}

export class PredictionData{
    date:number;
    open:number
    high:number
    low:number
    close:number
    volume:number
    y_test:number
    y_pred:number
    adjClose:number

    constructor({date,open,high,low,close,volume,y_test,y_pred,adjClose}:{date:number,open:number,high:number,low:number,close:number,volume:number,y_test:number,y_pred:number,adjClose:number}){
        this.date = date
        this.open = open
        this.high = high
        this.low = low
        this.close = close
        this.volume = volume
        this.y_test = y_test
        this.y_pred = y_pred
        this.adjClose = adjClose
    }

    static fromJson(json:{
        date: number;
        open: number;
        high: number;
        low: number;
        adjClose: number;
        volume: number;
        y_test: number;
        y_pred: number;
        abs_error: number;
        percent_error: number;
    }){
        return new PredictionData({
            date:json.date,
            open:json.open,
            high:json.high,
            low:json.low,
            close:json.y_test,
            volume:json.volume,
            y_test:json.y_test,
            y_pred:json.y_pred,
            adjClose:json.adjClose
        })
    }
}