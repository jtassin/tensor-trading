'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fetch = exports.DAYS_SHIFT = undefined;

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var math = require('mathjs');
var data = require('../resources/ATI.PA.csv.js').default;

var DAYS_SHIFT = exports.DAYS_SHIFT = 20;

var parsed = data.split('\n').map(function (row) {
  var result = row.split(',');
  result.splice(0, 1);
  result.splice(result.length - 1); // delete volume
  return result.map(function (item) {
    return parseFloat(item);
  });
});

parsed.pop();
parsed.splice(0, 2);

var rowsCount = parsed.length;

var colsCount = parsed[0].length;

var matrice = math.zeros(rowsCount - DAYS_SHIFT, 1 + colsCount);

console.log('matrice will be ', rowsCount, 'x', colsCount);

parsed.forEach(function (row, index) {
  // We do not use values older than 20 days ago
  if (index > rowsCount - DAYS_SHIFT) {
    return;
  }
  row.forEach(function (value, rowIndex) {
    matrice.subset(math.index(index, rowIndex + 1), value);
  });
});

parsed.forEach(function (row, index) {
  if (index < DAYS_SHIFT) {
    return;
  }
  if (index === 20) {
    console.log(index - DAYS_SHIFT, 0, row[4]);
  }
  matrice.subset(math.index(index - DAYS_SHIFT, 0), row[4]);
});

var result = JSON.parse((0, _stringify2.default)(matrice)).data;

console.log(result[1]);

// matrice.subset(math.index(DAYS_SHIFT - 1, [1, colsCount]), [2, 3]);  

// matrice.subset([math.index(0, 0), math.index(rowsCount -1, colsCount)],parsed);

var fetch = exports.fetch = function fetch() {
  return result;
};