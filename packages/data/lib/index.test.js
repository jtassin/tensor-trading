'use strict';

var math = require('mathjs');
var DAYS_SHIFT = require('./index').DAYS_SHIFT;

describe('data', function () {
  it('should have a ' + DAYS_SHIFT + ' days shift', function () {
    var data = require('./index').fetch();
    expect(data[0]).toEqual([3.038609, 3.390000, 3.400000, 3.380000, 3.380000, 2.893098, 818]);
    expect(data[3409]).toEqual([7.73, 7.510000, 7.540000, 7.480000, 7.530000, 7.530000, 2342]);
  });
});