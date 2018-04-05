const tf = require('@tensorflow/tfjs');
const fetch = require('tensor-trading-data').fetch;
const DAYS_SHIFT = require('tensor-trading-data').DAYS_SHIFT;

const runner = async () => {

  // A sequential model is a container which you can add layers to.
  const model = tf.sequential();

  let data = fetch();

  // Lets use last 20 lines for visual check
  const dataForpredicting = data.slice(data.length - 21, data.length -1);
  data = data.slice(0, data.length - 21);

  // Add a dense layer with 1 output unit.
  model.add(tf.layers.dense({ units: 1, inputShape: [data[0].length - 1] }));

  // Specify the loss type and optimizer for training.
  // optimizer was sgd
  // seemed less stupid
  model.compile({
    loss: 'meanSquaredError', optimizer: 'adam', metrics: ['accuracy'],
  });

  // Generate some synthetic data for training.
  // xs is the first 80%

  // const trainEnd = parseInt(0.8 * data.length);
  // const train = data.slice(0, trainEnd);
  const X = data.map((row) => row.slice(DAYS_SHIFT.length, row.length));
  const Y = data.map((row) => row.slice(0, DAYS_SHIFT.length));
  const xs = tf.tensor2d(X, [X.length, data[0].length - 1]);
  const ys = tf.tensor2d(Y, [Y.length, 1]);

  // Day of 2018/3/6 ATI.PA
  const predictionResults = dataForpredicting.map((row) => row[0]);
  const toPredict = dataForpredicting.map((row) => row.slice(1, row.length));
  // Expecting 7.61

const EPOCHS = 10;

  for (i = 1; i < 500; ++i) {
    const h = await model.fit(xs, ys, {
      // batchSize: 4,
      epochs: EPOCHS
    });
    // if(h.history.loss[0] < 1) {
    console.log("Loss after Epoch " + i + " : " + h.history.loss[0], '...', h.history.loss[h.history.loss.length - 1]);
    console.log("Accuracy after Epoch " + i + " : " + h.history.acc[0], '...', h.history.acc[h.history.acc.length - 1]);
    output = model.predict(tf.tensor2d(toPredict, [toPredict.length, data[0].length - 1]));
    const prediction = output.dataSync();
    console.log(predictionResults.map((item, i) => ([dataForpredicting[i][4], prediction[i],item])));
    // }
  }

  // let output = model.predict(tf.tensor2d([toPredict], [1, data[0].length - 1]));




  // console.log('before training');
  // output.print();


  // console.log('1 training ...');
  // // Train the model.
  // let history;

  // history = await model.fit(xs, ys, { epochs: 1 });

  // // After the training, perform inference.
  // output = model.predict(tf.tensor2d([toPredict], [1, data[0].length - 1]));
  // console.log('after 1 training accuracy is ', history.history.acc[0], 'loss is ', history.history.loss[0]);
  // output.print();

  // console.log('20 training ...');
  // // Train the model.
  // history = await model.fit(xs, ys, { epochs: 20 });

  // // After the training, perform inference.
  // output = model.predict(tf.tensor2d([toPredict], [1, data[0].length - 1]));
  // console.log('after 20 training accuracy is ', history.history.acc[0], 'loss is ', history.history.loss[0]);
  // output.print();

  // console.log('100 training ...');
  // // Train the model.
  // history = await model.fit(xs, ys, { epochs: 100 });

  // After the training, perform inference.
  // output = model.predict(tf.tensor2d([toPredict], [1, data[0].length - 1]));
  // // console.log('after 100 training accuracy is ', history.history.acc[0], 'loss is ', history.history.loss[0]);
  // output.print();

}

runner();


