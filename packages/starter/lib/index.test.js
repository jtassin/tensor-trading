'use strict';

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _index = require('../lib/index');

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('starter', function () {
  describe('processor', function () {
    it('solves simple problem', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee() {
      var result;
      return _regenerator2.default.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
              return (0, _index2.default)();

            case 2:
              result = _context.sent;

              expect(result[0]).toEqual([2.893098, 3.510000, 3.550000, 3.490000, 3.550000, 3.038609, 4333]);
              expect(result[3410]).toEqual([7.73, 3.510000, 3.550000, 3.490000, 3.550000, 3.038609, 4333]);

            case 5:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, undefined);
    })));
  });
});