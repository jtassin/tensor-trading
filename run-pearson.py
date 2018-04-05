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


# We will shift the matrix to detect the coorelation with x days of difference
days_shift = 20

# shifted_data = np.full((data.shape[0] + days_shift, data.shape[1]), 0)
arr = data.values.copy()
arr.resize((data.shape[0] + days_shift, data.shape[1]))
shifted_data = pd.DataFrame(arr)
shifted_data = shifted_data.shift(days_shift)
arr = closes.values.copy()
closes = closes.reindex(pd.RangeIndex(start=0, stop=closes_count + days_shift, step=1))
# closes = closes.shift(days_shift)
for i in range(days_shift):
  closes[i + closes_count] = 0
# shifted_data = shifted_data.add(closes, axis='columns')
shifted_data.insert(0, column="20_close", value=closes)
shifted_data = shifted_data.fillna(0)
print(shifted_data)

n_neurons_1 = 1024
n_neurons_2 = 512
n_neurons_3 = 256
n_neurons_4 = 128

criterias_count = shifted_data.shape[1]

print("Working on ", closes_count, "closes. With", criterias_count, "criterias")

sigma = 1
weight_initializer = tf.variance_scaling_initializer(mode="fan_avg", distribution="uniform", scale=sigma)
bias_initializer = tf.zeros_initializer()

X = tf.placeholder(dtype=tf.float32, shape=[None, criterias_count])
Y = tf.placeholder(dtype=tf.float32, shape=[None])

W_hidden_1 = tf.Variable(weight_initializer([criterias_count, n_neurons_1]))
bias_hidden_1 = tf.Variable(bias_initializer([n_neurons_1]))
W_hidden_2 = tf.Variable(weight_initializer([n_neurons_1, n_neurons_2]))
bias_hidden_2 = tf.Variable(bias_initializer([n_neurons_2]))
W_hidden_3 = tf.Variable(weight_initializer([n_neurons_2, n_neurons_3]))
bias_hidden_3 = tf.Variable(bias_initializer([n_neurons_3]))
W_hidden_4 = tf.Variable(weight_initializer([n_neurons_3, n_neurons_4]))
bias_hidden_4 = tf.Variable(bias_initializer([n_neurons_4]))

# Hidden layer
hidden_1 = tf.nn.relu(tf.add(tf.matmul(X, W_hidden_1), bias_hidden_1))
hidden_2 = tf.nn.relu(tf.add(tf.matmul(hidden_1, W_hidden_2), bias_hidden_2))
hidden_3 = tf.nn.relu(tf.add(tf.matmul(hidden_2, W_hidden_3), bias_hidden_3))
hidden_4 = tf.nn.relu(tf.add(tf.matmul(hidden_3, W_hidden_4), bias_hidden_4))

