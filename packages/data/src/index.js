const math = require('mathjs');
const data = require('../resources/ATI.PA.csv.js').default;

export const DAYS_SHIFT = 20;

const parsed = data.split('\n').map((row) => {
  const result = row.split(',');
  result.splice(0, 1);
  result.splice(result.length-1); // delete volume
  return result.map((item) => parseFloat(item));
});

parsed.pop();
parsed.splice(0, 2);

const rowsCount = parsed.length;

const colsCount = parsed[0].length;

const matrice = math.zeros(rowsCount - DAYS_SHIFT, 1 + colsCount);

console.log('matrice will be ', rowsCount, 'x', colsCount);

parsed.forEach((row, index) => {
  // We do not use values older than 20 days ago
  if (index > rowsCount - DAYS_SHIFT) {
    return
  }
  row.forEach((value, rowIndex) => {
    matrice.subset(math.index(index, rowIndex + 1), value);
  });
});

parsed.forEach((row, index) => {
  if (index < DAYS_SHIFT) {
    return
  }
  if(index === 20) {
    console.log(index - DAYS_SHIFT, 0, row[4]);
  }
  matrice.subset(math.index(index - DAYS_SHIFT, 0), row[4]);
});

const result = JSON.parse(JSON.stringify(matrice)).data;

console.log(result[1]);

// matrice.subset(math.index(DAYS_SHIFT - 1, [1, colsCount]), [2, 3]);  

// matrice.subset([math.index(0, 0), math.index(rowsCount -1, colsCount)],parsed);

export const fetch = () => result;