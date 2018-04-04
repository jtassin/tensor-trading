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
    var model, data, X, Y, xs, ys, toPredict, output, history;
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
            model.compile({ loss: 'meanSquaredError', optimizer: 'sgd', metrics: ['accuracy']
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
            // Expecting 7.68

            output = model.predict(tf.tensor2d([toPredict], [1, data[0].length - 1]));

            console.log('before training');
            output.print();

            console.log('small training ...');
            // Train the model.
            history = void 0;
            _context.next = 16;
            return model.fit(xs, ys, { epochs: 1 });

          case 16:
            history = _context.sent;


            // After the training, perform inference.
            output = model.predict(tf.tensor2d([toPredict], [1, data[0].length - 1]));
            console.log('after small training accuracy is ', history.history.acc[0], 'loss is ', history.history.loss[0]);
            output.print();

            console.log('massive training ...');
            // Train the model.
            _context.next = 23;
            return model.fit(xs, ys, { epochs: 20 });

          case 23:
            history = _context.sent;


            // After the training, perform inference.
            output = model.predict(tf.tensor2d([toPredict], [1, data[0].length - 1]));
            console.log('after massive training accuracy is ', history.history.acc[0], 'loss is ', history.history.loss[0]);
            output.print();

            console.log('huge training ...');
            // Train the model.
            _context.next = 30;
            return model.fit(xs, ys, { epochs: 500 });

          case 30:
            history = _context.sent;


            // After the training, perform inference.
            output = model.predict(tf.tensor2d([toPredict], [1, data[0].length - 1]));
            console.log('after huge training accuracy is ', history.history.acc[0], 'loss is ', history.history.loss[0]);
            output.print();

          case 34:
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