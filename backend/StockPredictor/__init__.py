import numpy as np
import pandas as pd
import time
import datetime
from sklearn.preprocessing import MinMaxScaler
from sklearn.compose import ColumnTransformer
from keras.models import Sequential
from keras.layers import Dense,Activation
from tensorflow.keras.optimizers import Adam
import matplotlib.pyplot as plt
from tensorflow.keras.models import load_model

info = {
    'BAJAJ-AUTO':{
        'adjustment':1000,
        'filepath':"models\\BAJAJ-AUTO-0.5225308941184547.h5"
    }
}

class PredictorEntity:
    def __init__(self,name,dense_layer_sizes=[1],lr=None,activation=None,epochs=1):
        self.name = name
        self.dense_layer_sizes = dense_layer_sizes
        self.lr = lr
        self.activation = activation
        self.epochs = epochs

class StockData:
    def __init__(self,data:pd.DataFrame):
        self.data = data
        self.data.columns = [col.upper() for col in self.data.columns]
        self.data["DATE"] = data["DATE"].apply(lambda x:time.mktime(datetime.datetime.strptime(x, "%d-%m-%Y").timetuple()))

    def dataframe(self):
        return self.data

    def dropna(self):
        self.data = self.data.dropna().reset_index(drop=True)

    def length(self):
        return len(self.data)

    def append_rsi(self,period):
        gain = [0]
        loss = [0]
        for i in range(1,len(self.data)):
            if self.data['CLOSE'][i] > self.data['CLOSE'][i-1]:
                gain.append(np.around(abs(self.data['CLOSE'][i] - self.data['CLOSE'][i-1]),5))
                loss.append(0)
                continue
            if self.data['CLOSE'][i] < self.data['CLOSE'][i-1]:
                loss.append(np.around(abs(self.data['CLOSE'][i] - self.data['CLOSE'][i-1]),5))
                gain.append(0)
                continue
            gain.append(0)
            loss.append(0)
        self.data["GAIN"] = pd.Series(gain)
        self.data["LOSS"] = pd.Series(loss)
        self.data['AVERAGE_GAIN'] = self.data['GAIN'].rolling(period).mean()
        self.data['AVERAGE_LOSS'] = self.data['LOSS'].rolling(period).mean()
        self.data['RS'] = self.data['AVERAGE_GAIN']/self.data['AVERAGE_LOSS']
        self.data[f'RSI{period}'] = 100 - (100/(1+self.data['RS'])).round(4)
        self.data[f'RSI{period}'] = self.data[f'RSI{period}'].fillna(100)
        for i in range(period-1):
            self.data[f'RSI{period}'][i] = 'NaN'
        self.data = self.data.drop(['GAIN','LOSS','AVERAGE_GAIN','AVERAGE_LOSS','RS'],axis=1)

    def append_cci(self,period):
        self.data['TP'] = (self.data['CLOSE']+self.data['HIGH']+self.data['LOW'])/3
        self.data['SMA'] = self.data['TP'].rolling(period).mean()
        mad = lambda x: np.fabs(x - x.mean()).mean()
        self.data['AVEDEV'] = self.data['TP'].rolling(period).apply(mad,raw=True)
        self.data[f'CCI{period}'] = (self.data['TP'] - self.data['SMA'])/(0.015*self.data['AVEDEV'])
        self.data = self.data.drop(['TP','SMA','AVEDEV'],axis=1)

    def append_momentum(self,period):
        dev = [np.nan for i in range(period)]
        for i in range(period,len(self.data)):
            dev.append(self.data['CLOSE'][i] - self.data['CLOSE'][i-period])
        self.data[f"MOM{period}"] = pd.Series(dev)

    def append_ema(self,period):
        self.data[f"EMA{period}"] = self._get_ema(self.data,period)

    def append_sma(self,period):
        dev = [np.nan for i in range(period)]
        for i in range(period,len(self.data)):
            dev.append(self.data['CLOSE'][i] - self.data['CLOSE'][i-period])
        self.data[f"SMA{period}"] = pd.Series(dev)

    def append_rocr(self,period):
        dev = [np.nan for i in range(period)]
        for i in range(period,len(self.data)):
            dev.append(self.data['CLOSE'][i] - self.data['CLOSE'][i-period])
        self.data[f"MOM"] = pd.Series(dev)
        self.data[f"ROCR{period}"] = self.data['MOM'] * 100 / self.data['CLOSE']
        self.data = self.data.drop(['MOM'],axis=1)

    def append_williams_r(self,period=14):
        self.data['HIGH14_temp'] = self.data['CLOSE'].rolling(period).max()
        self.data['LOW14_temp'] = self.data['CLOSE'].rolling(period).min()
        self.data[f'WILLR{period}'] = (self.data['HIGH14_temp']-self.data['CLOSE']) * -100 / (self.data['HIGH14_temp']-self.data['LOW14_temp'])
        self.data = self.data.drop(['HIGH14_temp','LOW14_temp'],axis=1)

    def append_bollingerbands(self,period=20):
        self.data[f"BBANDSMIDDLE{period}"] = self.data['CLOSE'].rolling(period).mean()
        self.data[f"STDDEV"] = self.data['CLOSE'].rolling(period).std()
        self.data[f"BBANDSUPPER{period}"] = self.data[f"BBANDSMIDDLE{period}"] + 2 * self.data[f"STDDEV"]
        self.data[f"BBANDSLOWER{period}"] = self.data[f"BBANDSMIDDLE{period}"] - 2 * self.data[f"STDDEV"]
        self.data = self.data.drop(['STDDEV'],axis=1)

    def _get_ema(self,data,period):
        return self.data['CLOSE'].ewm(span=period).mean()
        
    def append_macd(self,with_signal=True,with_hist=True):
        self.data['MACD'] = self._get_ema(self.data,12) - self._get_ema(self.data,26)
        if with_hist:
            self.data['SMA'] = self.data['MACD'].rolling(9).mean()
            ema = [np.nan for i in range(32)]
            ema.append(self.data['SMA'][33])
            for i in range(33,len(self.data)):
                val = ema[i-1] + ((self.data['MACD'][i] - ema[len(ema)-1]) / 5)
                ema.append(np.around(val,5))
            self.data = self.data.drop(['SMA'],axis=1)
            self.data['MACDSIGNAL'] = ema
            self.data['MACDHIST'] = self.data['MACD'] - self.data['MACDSIGNAL']
        
        if not with_signal:
            self.data = self.data.drop(['MACDSIGNAL'],axis=1)

class Predictor:
    def __init__(self,data:pd.DataFrame,stock:PredictorEntity):
        self.data = StockData(data)
        self.stock = stock
                
        self._append_indicators()

        df = self.data.dataframe()
        x = df.drop("CLOSE",axis=1)
        y = pd.DataFrame(df["CLOSE"],columns=['CLOSE'])
        x = x.head(x.shape[0]-1)
        y = y.tail(y.shape[0]-1)
        ct = ColumnTransformer([("transformer",MinMaxScaler(),list(x.columns))])
        x = pd.DataFrame(ct.fit_transform(x),columns=list(x.columns))
        LEN = len(df)*3//4
        self.x_train = x.iloc[:LEN,:]
        self.y_train = y.iloc[:LEN,:]
        self.x_test = x.iloc[LEN:,:]
        self.y_test = y.iloc[LEN:,:]

    def compile(self):
        self.model = Sequential()        
        if self.stock.activation != None:
            self.model.add(Activation('relu'))
        for i in self.stock.dense_layer_sizes:
            self.model.add(Dense(i))
        if self.stock.dense_layer_sizes[-1] != 1:
            self.model.add(Dense(1))
        self.model.compile(Adam(lr=self.stock.lr), 'mean_squared_error')
        self.model.fit(self.x_train, self.y_train, epochs = self.stock.epochs, validation_split = 0.1,verbose = 0)

    def test_predict(self):
        assert self.model != None , f"Error initializing neural network."
        y_pred = self.model.predict(self.x_test)
        
        df = self.data.dataframe()
        df = df[::-1]
        x = df.drop("CLOSE",axis=1)
        y = pd.DataFrame(df["CLOSE"],columns=['CLOSE'])
        x = x.head(x.shape[0]-1)
        y = y.tail(y.shape[0]-1)
        LEN = len(df)*3//4
        x_test = x.iloc[LEN:,:]
        y_test = y.iloc[LEN:,:]
        
        self.res = pd.concat([x_test.reset_index(drop=True),y_test['CLOSE'].reset_index(drop=True),pd.DataFrame(y_pred)],ignore_index=True,axis=1)
        self.res.columns = list(x_test.columns) + ['y_test','y_pred']
        self.res['abs_error'] = abs(self.res['y_test'] - self.res['y_pred'])
        self.res['percent_error'] = self.res['abs_error'] * 100 / self.res['y_test']
        return self.res

    def _append_indicators(self):
        self.data.append_rsi(3)        
        self.data.append_rsi(6)
        self.data.append_rsi(14)
        self.data.append_rsi(50)
        self.data.append_rsi(100)

        self.data.append_momentum(1)
        self.data.append_momentum(3)

        self.data.append_ema(6)
        self.data.append_ema(12)

        self.data.append_sma(3)

        self.data.append_rocr(3)
        self.data.append_rocr(12)

        self.data.append_cci(12)
        self.data.append_cci(20)

        self.data.append_bollingerbands()

        self.data.append_williams_r()

        self.data.append_macd()

        self.data.dropna()

    def show_results(self):
        assert self.res is not None , "No results to show. Try calling predict() first."
        plt.rcParams["figure.figsize"] = [60, 15]
        plt.rcParams["font.size"] = 40
        plt.rcParams["axes.labelsize"] = 60
        plt.plot(self.res['y_test'],label='y_test',color='blue')
        plt.plot(self.res['y_pred'],label='y_pred',color='red')
        plt.ylabel("Price")
        plt.xlim(xmin=0,xmax=len(self.res['y_test']))
        plt.legend(prop={'size':30})
        plt.show()
        plt.rcParams.update({
            "figure.figsize":[6.4,4.8],
            "font.size":10,
            "axes.labelsize":'medium',
        })

    def quickshow_results(self):
        assert self.res is not None , "No results to show. Try calling predict() first."
        plt.plot(self.res['y_test'],label='y_test',color='blue')
        plt.plot(self.res['y_test'],label='y_test',color='red')
        plt.ylabel("Price")
        plt.xlim(xmin=0,xmax=len(self.res['y_test']))
        plt.legend()
        plt.show()

    def metrics(self):
        return f'''
        "Max Absolute Error":{self.res['abs_error'].max()},
        "Max Percent Error":{self.res['percent_error'].max()},
        "Average Absolute Error":{self.res['abs_error'].mean()},
        "Average Percent Error":{self.res['percent_error'].mean()},
        '''

    def save_model(self):
        self.model.save(f"models\\{self.stock.name}\\{self.res['percent_error'].mean()}.h5",save_format='h5')

    def load_model(self,filepath=None):
        if filepath==None:
            filepath = info[self.stock.name]['filepath']
        self.model = load_model(filepath)
        self.test_predict()

    def predict(self,x):
        return self.model.predict(x)
        
