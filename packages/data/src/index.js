const math = require('mathjs');
const fs = require('fs');
const data = require('../resources/ATI.PA.csv.js').default;
const RSI = require('technicalindicators').RSI;
const ADL = require('technicalindicators').ADL;
const ADX = require('technicalindicators').ADX;
const ATR = require('technicalindicators').ATR;
const AO = require('technicalindicators').AwesomeOscillator;
const BB = require('technicalindicators').BollingerBands;

export const OPEN_INDEX = 0;

export const HIGH_INDEX = 1;

export const LOW_INDEX = 2;

export const CLOSE_INDEX = 3;

export const ADJ_CLOSE_INDEX = 4;

export const VOLUME_INDEX = 5;

/**
 * Compute and add the standard moving average
 * 
 * @param {number[][]} data 
 * @param {Number} value 
 */
export function addSMA(data, value) {
  const lasts = [];
  const reducer = (accumulator, currentValue) => accumulator + currentValue;
  data.forEach((row, index) => {
    lasts.unshift(row[ADJ_CLOSE_INDEX]);
    const slicedArray = lasts.slice(0, value);
    const sum = slicedArray.reduce(reducer);
    row.push(parseFloat(sum) / parseFloat(value));
  });
}

export function allAdjCloses(data) {
  return parsed.map((row) => (row[ADJ_CLOSE_INDEX]));
}

export function allVolumes(data) {
  return parsed.map((row) => (row[VOLUME_INDEX]));
}

export function allHigh(data) {
  return parsed.map((row) => (row[HIGH_INDEX]));
}

export function allLow(data) {
  return parsed.map((row) => (row[LOW_INDEX]));
}

export function allCloses(data) {
  return parsed.map((row) => (row[ADJ_CLOSE_INDEX]));
}

export function addAO(data, fastPeriod = 5, slowPeriod=34) {
  const aos = AO.calculate({ high: allHigh(data), low: allLow(data), fastPeriod, slowPeriod });
  aos.forEach((ao, index) => {
    const row = data[index];
    row.push(ao);
  });
}

export function addADL(data) {
  const adls = ADL.calculate({ high: allHigh(data), low: allLow(data), close: allCloses(data), volume: allVolumes(data) });
  adls.forEach((adl, index) => {
    const row = data[index];
    row.push(adl);
  });
}



export function addATR(data, period = 14) {
  const atrs = ATR.calculate({ high: allHigh(data), low: allLow(data), close: allCloses(data), period: period });
  atrs.forEach((atr, index) => {
    const row = data[index];
    row.push(atr);
  });
}

export function addBB(data, stdDev = 2, period = 14) {
  const values = allAdjCloses(data);
  const bbs = BB.calculate({ values, stdDev, period });
  bbs.forEach((bb, index) => {
    const row = data[index];
    row.push(bb.lower);
    row.push(bb.middle);
    row.push(bb.upper);
  });
}

export function addADX(data, period = 14) {
  const adxs = ADX.calculate({ high: allHigh(data), low: allLow(data), close: allCloses(data), period: period });
  adxs.forEach((adx, index) => {
    const row = data[index];
    row.push(adx.adx);
    row.push(adx.pdi);
    row.push(adx.mdi);
  });
}

export function addRSI(data, period = 14) {
  const rsis = RSI.calculate({ values: allAdjCloses(data), period });
  rsis.forEach((rsi, index) => {
    const row = data[index];
    row.push(rsi);
  });
}

export const DAYS_SHIFT = [20, 10, 5];

const maxdayShift = 20; //Math.max(DAYS_SHIFT);

const parsed = data.split('\n').map((row) => {
  const result = row.split(',');
  result.splice(0, 1);
  // result.splice(result.length-1); // delete volume
  return result.map((item) => parseFloat(item));
});

parsed.pop();
parsed.splice(0, 2);

addSMA(parsed, 10);
addSMA(parsed, 20);
addSMA(parsed, 50);
addRSI(parsed, 14);
addADL(parsed);
addADX(parsed);
addATR(parsed);
addAO(parsed);
addBB(parsed);

const rowsCount = parsed.length;

const colsCount = parsed[0].length;

console.log('matrice will be ', rowsCount - maxdayShift, 'x', 1 + DAYS_SHIFT.length + colsCount);
const matrice = math.zeros(rowsCount - maxdayShift, DAYS_SHIFT.length + colsCount);

parsed.forEach((row, index) => {
  // We do not use values older than 20 days ago
  if (index > rowsCount - 5) {
    return
  }
  row.forEach((value, rowIndex) => {
    matrice.subset(math.index(index, rowIndex + DAYS_SHIFT.length), value);
  });
});

DAYS_SHIFT.forEach((daysShift, daysShiftIndex) => {

  // parsed.forEach((row, index) => {
  //   // We do not use values older than 20 days ago
  //   if (index > rowsCount - maxdayShift) {
  //     return
  //   }
  //   row.forEach((value, rowIndex) => {
  //     matrice.subset(math.index(index, daysShiftIndex * colsCount + rowIndex + 1), value);
  //   });
  // });

  parsed.forEach((row, index) => {
    if (index < maxdayShift) {
      return
    }
    matrice.subset(math.index(index - daysShift, daysShiftIndex), row[ADJ_CLOSE_INDEX]);
  });

});
const result = JSON.parse(JSON.stringify(matrice)).data;

console.log(result[0]);
console.log(result[1000]);

console.log(result[3409]);


// matrice.subset(math.index(DAYS_SHIFT - 1, [1, colsCount]), [2, 3]);  

// matrice.subset([math.index(0, 0), math.index(rowsCount -1, colsCount)],parsed);

fs.writeFile("../resources/ATI.PA.transformed", JSON.stringify(result), function (err) {
  if (err) {
    return console.log(err);
  }

  console.log("The file was saved!");
});


export const fetch = () => result;