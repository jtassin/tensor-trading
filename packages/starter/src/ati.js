const tf = require('@tensorflow/tfjs');

const runner  = async () => {

  // A sequential model is a container which you can add layers to.
  const model = tf.sequential();

  // Add a dense layer with 1 output unit.
  model.add(tf.layers.dense({ units: 1, inputShape: [1] }));

  // Specify the loss type and optimizer for training.
  model.compile({ loss: 'meanSquaredError', optimizer: 'sgd', metrics: ['accuracy'] });

  // Generate some synthetic data for training.
  const xs = tf.tensor2d([[1], [2], [3], [4]], [4, 1]);
  const ys = tf.tensor2d([[1], [3], [5], [7]], [4, 1]);

  // Train the model.
  let h;


  h = await model.fit(xs, ys, { epochs: 1 });
  console.log("Loss after Epoch " + 1 + " : " + h.history.loss[0], '...', h.history.loss[h.history.loss.length - 1]);
      console.log("Accuracy after Epoch " + 1 + " : " + h.history.acc[-1]);

      h = await model.fit(xs, ys, { epochs: 500 });
  console.log("Loss after Epoch " + 500 + " : " + h.history.loss[-1]);
      console.log("Accuracy after Epoch " + 500 + " : " + h.history.acc[-1]);

      h = await model.fit(xs, ys, { epochs: 5000 });
  console.log("Loss after Epoch " + 5000 + " : " + h.history.loss[0]);
      console.log("Accuracy after Epoch " + 5000 + " : " + h.history.acc[0]);

  // After the training, perform inference.
  const output = model.predict(tf.tensor2d([[5]], [1, 1]));
  console.log(output);
  output.print();

}

runner();
