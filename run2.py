import tensorflow as tf
import tensorflow.contrib.eager as tfe
# CSV Lib
import pandas as pd
# Computation lib
import numpy as np
# Scale data
from sklearn.preprocessing import MinMaxScaler

import random


# Import data
data = pd.read_csv('initialData/ATI.PA.csv')

data = data.drop(['Date'], 1)
data = data.drop(['Open'], 1)
data = data.drop(['High'], 1)
data = data.drop(['Low'], 1)
data = data.drop(['Close'], 1)
data = data.drop(['Volume'], 1)

rows_count = data.shape[0]
cols_count = data.shape[1]

# Avoid TypeError: unhashable type: 'numpy.ndarray'
data = data.values

print('cols_count', cols_count)
print('rows_count', rows_count)

# We use 80% of the data as train data
train_start = 0
train_end = int(np.floor(0.8*rows_count))
print('train is ', train_start, '-', train_end)
test_start = train_end + 1
# np.arange => https://docs.scipy.org/doc/numpy/reference/generated/numpy.arange.html
data_train = data[np.arange(train_start, train_end), :]


# The others 20% as tests
test_end = rows_count
print('test is ', test_start, '-', test_end)
# np.arange => https://docs.scipy.org/doc/numpy/reference/generated/numpy.arange.html
data_test = data[np.arange(test_start, test_end), :]

# We need to scale datas
# Most algorithms need data in the interval [-1, 1] or [0, 1]
scaler = MinMaxScaler(feature_range=(-1, 1))
scaler.fit(data_train)
data_train = scaler.transform(data_train)
data_test = scaler.transform(data_test)

X_train = data_train[:, 1:] 
print('X_train shape is ', X_train.shape)
print('X_train is ', X_train)
y_train = data_train[:, 0] 
print('y_train shape is ', y_train.shape)
print('y_train is ', y_train)
X_test = data_test[:, 1:]
print('X_test shape is ', X_test.shape)
y_test = data_test[:, 0]
print('y_test shape is ', y_test.shape)

# 4 neuron networks
n_neurons_1 = 1024
n_neurons_2 = 512
n_neurons_3 = 256
n_neurons_4 = 128

sigma = 1
weight_initializer = tf.variance_scaling_initializer(mode="fan_avg", distribution="uniform", scale=sigma)
bias_initializer = tf.zeros_initializer()

n_stocks = X_train.shape[1]
print('n_stocks is', n_stocks)

session = tf.InteractiveSession()
# https://www.tensorflow.org/api_docs/python/tf/placeholder
X = tf.placeholder(dtype=tf.float32, shape=[None, n_stocks])
print('X is ', X)
# https://www.tensorflow.org/api_docs/python/tf/placeholder
Y = tf.placeholder(dtype=tf.float32, shape=[None])
print('Y is ', Y)

# Hidden steps
W_hidden_1 = tf.Variable(weight_initializer([n_stocks, n_neurons_1]))
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

# Final output
W_out = tf.Variable(weight_initializer([n_neurons_4, 1]))
bias_out = tf.Variable(bias_initializer([1]))

out = tf.transpose(tf.add(tf.matmul(hidden_4, W_out), bias_out))

mean_square_error = tf.reduce_mean(tf.squared_difference(out, Y))

def compute_difference(out, y):
  return tf.reduce_mean(tf.squared_difference(out, y))

optimizer = tf.train.AdamOptimizer().minimize(mean_square_error)

session.run(tf.global_variables_initializer())

mse_train = []
mse_test = []
differences = []

num_epochs = 201

batch_size = 256

file_writer = tf.summary.FileWriter('/tmp/tb_logs', session.graph)

for epoch in range(num_epochs):
  epoch_loss_avg = tfe.metrics.Mean()
  epoch_diff_avg = tfe.metrics.Mean()
  epoch_accuracy = tfe.metrics.Accuracy()
  for i in range(batch_size):
    # We use 20% of the train data for each run
    start = int(0.8 * random.random() * rows_count)
    #print(start)
    batch_x = X_train[start:start + batch_size]
    # print(batch_x)
    # batch_x = X_train
    batch_y = y_train[start:start + batch_size]
    # print(batch_y)
    # batch_y = y_train
    session.run(optimizer, feed_dict={X: batch_x, Y: batch_y})
    # epoch_accuracy(tf.argmax(model(x), axis=1, output_type=tf.int32), y)
  if epoch % 5 == 0:
    tf.summary.scalar('max', tf.reduce_max(tf.squared_difference(out, Y)))
    tf.summary.scalar('min', tf.reduce_min(tf.squared_difference(out, Y)))
    # print("Epoch {:03d}: Diff: {:.3f}".format(epoch, epoch_diff_avg.result()))
    mse_train.append(session.run(compute_difference(out, y_train), feed_dict={X: X_train, Y: y_train}))
    mse_test.append(session.run(compute_difference(out, y_test), feed_dict={X: X_test, Y: y_test}))
    print('epoch', epoch, 'run', i, 'MSE Train: ', mse_train[-1], 'MSE Test: ', mse_test[-1])
