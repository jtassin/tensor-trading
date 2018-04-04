'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var tf = require('@tensorflow/tfjs');

var runner = function () {
  var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee() {
    var model, xs, ys, output;
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:

            // A sequential model is a container which you can add layers to.
            model = tf.sequential();

            // Add a dense layer with 1 output unit.

            model.add(tf.layers.dense({ units: 1, inputShape: [1] }));

            // Specify the loss type and optimizer for training.
            model.compile({ loss: 'meanSquaredError', optimizer: 'sgd' });

            // Generate some synthetic data for training.
            xs = tf.tensor2d([[1], [2], [3], [4]], [4, 1]);
            ys = tf.tensor2d([[1], [3], [5], [7]], [4, 1]);

            // Train the model.

            _context.next = 7;
            return model.fit(xs, ys, { epochs: 500 });

          case 7:

            // After the training, perform inference.
            output = model.predict(tf.tensor2d([[5]], [1, 1]));

            console.log(output);
            output.print();

          case 10:
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

exports.default = runner;
module.exports = exports['default'];