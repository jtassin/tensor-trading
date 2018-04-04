'use strict';

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var tf = require('@tensorflow/tfjs');
var fetch = require('tensor-trading-data').fetch;

var runner = function () {
  var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee() {
    var model, data, X, Y, xs, ys, toPredict, h;
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:

            // A sequential model is a container which you can add layers to.
            model = tf.sequential();
            data = fetch();

            // Add a dense layer with 1 output unit.

            model.add(tf.layers.dense({ units: 1, inputShape: [data[0].length - 1] }));

            // Specify the loss type and optimizer for training.
            // optimizer was sgd
            // seemed less stupid
            model.compile({ loss: 'meanSquaredError', optimizer: 'adam', metrics: ['accuracy']
            });

            // Generate some synthetic data for training.
            // xs is the first 80%

            // const trainEnd = parseInt(0.8 * data.length);
            // const train = data.slice(0, trainEnd);
            X = data.map(function (row) {
              return row.slice(1, row.length);
            });
            Y = data.map(function (row) {
              return row[0];
            });
            xs = tf.tensor2d(X, [X.length, data[0].length - 1]);
            ys = tf.tensor2d(Y, [Y.length, 1]);

            // Day of 2018/3/6 ATI.PA

            toPredict = [7.36, 7.36, 7.12, 7.20, 7.20];
            // Expecting 7.61

            i = 1;

          case 10:
            if (!(i < 500)) {
              _context.next = 19;
              break;
            }

            _context.next = 13;
            return model.fit(xs, ys, {
              // batchSize: 4,
              epochs: 3
            });

          case 13:
            h = _context.sent;

            console.log("Loss after Epoch " + i + " : " + h.history.loss[0]);
            console.log("Accuracy after Epoch " + i + " : " + h.history.acc[0]);

          case 16:
            ++i;
            _context.next = 10;
            break;

          case 19:

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
            output = model.predict(tf.tensor2d([toPredict], [1, data[0].length - 1]));
            // console.log('after 100 training accuracy is ', history.history.acc[0], 'loss is ', history.history.loss[0]);
            output.print();

          case 21:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, undefined);
  }));

  return function runner() {
    return _ref.apply(this, arguments);
  };
}();

runner();