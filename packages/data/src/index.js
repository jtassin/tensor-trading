const math = require('mathjs');
const fs = require('fs');
const data = require('../resources/ATI.PA.csv.js').default;

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

const rowsCount = parsed.length;

const colsCount = parsed[0].length;

console.log('matrice will be ', rowsCount - maxdayShift, 'x', 1 + DAYS_SHIFT.length + colsCount);
const matrice = math.zeros(rowsCount - maxdayShift,  DAYS_SHIFT.length + colsCount);

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
    matrice.subset(math.index(index - daysShift, daysShiftIndex), row[4]);
  });

});
const result = JSON.parse(JSON.stringify(matrice)).data;

console.log(result[3409 ]);


// matrice.subset(math.index(DAYS_SHIFT - 1, [1, colsCount]), [2, 3]);  

// matrice.subset([math.index(0, 0), math.index(rowsCount -1, colsCount)],parsed);

fs.writeFile("../resources/ATI.PA.transformed", JSON.stringify(result), function(err) {
    if(err) {
        return console.log(err);
    }

    console.log("The file was saved!");
}); 


export const fetch = () => result;