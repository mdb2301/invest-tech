import requests
from bs4 import BeautifulSoup
import json
import pandas as pd
import time
import datetime

stocks = {
    'TATAMOTORS':{
        'name':'Tata Motors Limited',
        'image':"https://listcarbrands.com/wp-content/uploads/2017/10/2017-logo-Tata-Motors.jpg"
    },
    'HDFCBANK':{
        'name':'HDFC Bank',
        'image':"http://www.logotaglines.com/wp-content/uploads/2016/08/HDFC_Bank_Logo.jpg"
    },
    'INFY':{
        'name':'Infosys',
        'image':"https://upload.wikimedia.org/wikipedia/commons/thumb/9/95/Infosys_logo.svg/1280px-Infosys_logo.svg.png"
    },
    'BHARTIARTL':{
        'name':'Bharati Airtel',
        'image':"https://upload.wikimedia.org/wikipedia/commons/f/fb/Bharti_Airtel_Logo.svg"
    },
    'ADANIPORTS':{
        'name':'Adani Ports & SEZ',
        'image':"https://upload.wikimedia.org/wikipedia/en/thumb/9/9a/Adani_Ports_Logo.svg/1200px-Adani_Ports_Logo.svg.png"
    }
}

headers =  {"accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
    "accept-encoding": "gzip, deflate, br",
    "accept-language": "en-GB,en;q=0.9,en-US;q=0.8,ml;q=0.7",
    "cache-control": "max-age=0",
    "dnt": "1",
    "sec-fetch-dest": "document",
    "sec-fetch-mode": "navigate",
    "sec-fetch-site": "none",
    "sec-fetch-user": "?1",
    "upgrade-insecure-requests": "1",
    "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.122 Safari/537.36"}

def get_data(ticker):
    pass

def get_info(ticker):
    res = requests.get(
        f'https://finance.yahoo.com/quote/{ticker}.NS?p={ticker}.NS&.tsrc=fin-srch',
        headers=headers,
        verify=False
    )

    soup = BeautifulSoup(res.text,'html.parser')

    openPrice = float(soup.find('td',{'data-test':'OPEN-value'}).decode_contents().replace(',',''))
    
    dayLow = float(soup.find('td',{'data-test':'DAYS_RANGE-value'}).decode_contents().split(' - ')[0].replace(',',''))
    dayHigh = float(soup.find('td',{'data-test':'DAYS_RANGE-value'}).decode_contents().split(' - ')[1].replace(',',''))

    low52 = float(soup.find('td',{'data-test':'FIFTY_TWO_WK_RANGE-value'}).decode_contents().split(' - ')[0].replace(',',''))
    high52 = float(soup.find('td',{'data-test':'FIFTY_TWO_WK_RANGE-value'}).decode_contents().split(' - ')[1].replace(',',''))

    lastPrice = float(soup.find('fin-streamer',{'data-field':'regularMarketPrice','data-symbol':f'{ticker}.NS'}).decode_contents().replace(',',''))
    change = float(soup.find('fin-streamer',{'data-field':'regularMarketChange','data-symbol':f'{ticker}.NS'}).find('span').decode_contents().replace(',',''))
    percent_change = float((soup.find('fin-streamer',{'data-field':'regularMarketChangePercent','data-symbol':f'{ticker}.NS'}).find('span').decode_contents())[1:-2])
    volume = int(soup.find('fin-streamer',{'data-field':'regularMarketVolume','data-symbol':f'{ticker}.NS'}).decode_contents().replace(',',''))
    cap = soup.find('td',{'data-test':'MARKET_CAP-value'}).decode_contents().replace(',','')
    previousClose = soup.find('td',{'data-test':'PREV_CLOSE-value'}).decode_contents().replace(',','')
    
    df = pd.read_csv(f"datasets\\{ticker}.NS.csv")
    df = df.tail(100)
    df.columns = [col.lower() for col in df.columns]
    df.columns = ['adjClose' if col=='adj close' else col for col in df.columns]
    df["date"] = df["date"].apply(lambda x:time.mktime(datetime.datetime.strptime(x, "%Y-%m-%d").timetuple()))

    return Stock(ticker, stocks[ticker]['name'], lastPrice, change, percent_change, dayHigh, dayLow, high52, low52, openPrice, 0, volume, cap, previousClose, stocks[ticker]['image'],lastPrice,json.loads(df.to_json(orient='records')))


class Stock():
    def __init__(self,code,name,lastPrice,change,percent_change,dayHigh,dayLow,high52,low52,openPrice,closePrice,volume,cap,previousClose,logo,predicted_price,history):
        self.code = code
        self.name = name
        self.lastPrice = lastPrice
        self.change = float(change)
        self.percent_change = float(percent_change)
        self.dayHigh = dayHigh
        self.dayLow = dayLow
        self.high52 = high52
        self.low52 = low52
        self.openPrice = openPrice
        self.closePrice = closePrice
        self.volume = volume
        self.cap = cap
        self.previousClose = previousClose
        self.logo = logo
        self.predicted_price = predicted_price
        self.history = history

    def __repr__(self):
        return self.name + " : " + str(self.lastPrice) + " "+ str(self.change)

    def to_json(self):
        return {
            'symbol':self.code,
            'name':self.name,
            'lastPrice':self.lastPrice,
            'change':self.change,
            'changePercent':self.percent_change,
            'dayHigh':self.dayHigh,
            'dayLow':self.dayLow,
            'high52':self.high52,
            'low52':self.low52,
            'open':self.openPrice,
            'close':self.closePrice,
            'volume':self.volume,
            'cap':self.cap,
            'previousClose':self.previousClose,
            'logo':self.logo,
            'history':self.history
        }
