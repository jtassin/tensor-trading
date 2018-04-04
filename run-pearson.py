import tensorflow as tf
import numpy as np
import pandas as pd
from sklearn.preprocessing import MinMaxScaler



# Import data
data = pd.read_csv('initialData/ATI.PA.csv')

closes_count = data.shape[0]

closes = data['Close']
# Date is bullshit in our case
data = data.drop(['Date'], 1)

criterias_count = data.shape[1]

print("Working on ", closes_count, "closes. With", criterias_count, "criterias")

# We will shift the matrix to detect the coorelation with x days of difference
days_shift = 20

# shifted_data = np.full((data.shape[0] + days_shift, data.shape[1]), 0)
arr = closes.values.copy()
print((closes.shape[0] + days_shift, closes.shape[1]))
arr.resize((closes.shape[0] + days_shift, closes.shape[1]))

arr = data.values.copy()
arr.resize((data.shape[0] + days_shift, data.shape[1]))
shifted_data = pd.DataFrame(arr)
arr = closes.values.copy()
closes = closes.reindex(pd.RangeIndex(start=0, stop=closes_count + days_shift, step=1))
closes = closes.shift(days_shift)
for i in range(days_shift):
  closes[i] = 0
# shifted_data = shifted_data.add(closes, axis='columns')
shifted_data.insert(0, column="20_close", value=closes)
print(shifted_data)