from beautifulsoup import get_info_basic
from flask import Flask,jsonify
from flask_cors import CORS

app = Flask(__name__)

CORS(app)

stocks = ['BAJAJAUTO']
#stocks = ['TATAMOTORS','HDFCBANK','INFY','BHARTIARTL','ADANIPORTS']

@app.route('/',methods=['GET'])
def index():
    return jsonify(name="Mandar")

@app.route('/stocks-info',methods=['GET'])
def stock_info():
    res = []
    for stock in stocks:
        res.append(get_info_basic(stock).to_json())
    return jsonify(data=res)

if __name__=='__main__':
    app.run(port=5000)


