import pandas as pd

df = pd.read_csv("datasets\\BAJAJAUTO.csv")

print(df["Close"][len(df)-1])