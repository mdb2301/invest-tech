from beautifulsoup import get_info
from flask import Flask,jsonify
from flask_cors import CORS

app = Flask(__name__)

CORS(app)

stocks = ['TATAMOTORS','HDFCBANK','INFY','BHARTIARTL','ADANIPORTS']

@app.route('/',methods=['GET'])
def index():
    return jsonify(name="Mandar")

@app.route('/stocks-info',methods=['GET'])
def stock_info():
    res = []
    for stock in stocks:
        res.append(get_info(stock).to_json())
    return jsonify(data=res)

if __name__=='__main__':
    app.run(port=5000)


