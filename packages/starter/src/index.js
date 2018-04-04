const tf = require('@tensorflow/tfjs');
const fetch = require('tensor-trading-data').fetch;

const runner = async () => {

  // A sequential model is a container which you can add layers to.
  const model = tf.sequential();

  const data = fetch();

  // Add a dense layer with 1 output unit.
  model.add(tf.layers.dense({ units: 1, inputShape: [data[0].length - 1] }));

  // Specify the loss type and optimizer for training.
  model.compile({ loss: 'meanSquaredError', optimizer: 'sgd', metrics: ['accuracy'],
});

  // Generate some synthetic data for training.
  // xs is the first 80%

  // const trainEnd = parseInt(0.8 * data.length);
  // const train = data.slice(0, trainEnd);
  const X = data.map((row) => row.slice(1, row.length));
  const Y = data.map((row) => row[0]);
  const xs = tf.tensor2d(X, [X.length, data[0].length - 1]);
  const ys = tf.tensor2d(Y, [Y.length, 1]);

  // Day of 2018/3/6 ATI.PA
  const toPredict = [7.36, 7.36, 7.12, 7.20, 7.20];
  // Expecting 7.68

  let output = model.predict(tf.tensor2d([toPredict], [1, data[0].length - 1]));
  console.log('before training');
  output.print();


  console.log('small training ...');
  // Train the model.
  let history;
  
  history = await model.fit(xs, ys, { epochs: 1 });

  // After the training, perform inference.
  output = model.predict(tf.tensor2d([toPredict], [1, data[0].length - 1]));
  console.log('after small training accuracy is ', history.history.acc[0], 'loss is ', history.history.loss[0]);
  output.print();

  console.log('massive training ...');
  // Train the model.
  history = await model.fit(xs, ys, { epochs: 20 });

  // After the training, perform inference.
  output = model.predict(tf.tensor2d([toPredict], [1, data[0].length - 1]));
  console.log('after massive training accuracy is ', history.history.acc[0], 'loss is ', history.history.loss[0]);
  output.print();

  console.log('huge training ...');
  // Train the model.
  history = await model.fit(xs, ys, { epochs: 500 });

  // After the training, perform inference.
  output = model.predict(tf.tensor2d([toPredict], [1, data[0].length - 1]));
  console.log('after huge training accuracy is ', history.history.acc[0], 'loss is ', history.history.loss[0]);
  output.print();

}

runner();


