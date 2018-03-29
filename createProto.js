const fs = require('fs');
const parse = require('csv-parse');

var protobuf = require('protocol-buffers')

// pass a proto file as a buffer/string or pass a parsed protobuf-schema object
var messages = protobuf(fs.readFileSync('data.proto'))

var buf = messages.Stock.encode({
  close: 42,
  date: 'hello world'
})

console.log(buf) 

const inputFile='./initialData/ATI.PA.csv';

const readStream = fs.createReadStream(inputFile);

const writeSTream = fs.createWriteStream('./data/ati.proto.txt');

const parseOptions = {delimiter: ','};

const parser = parse(parseOptions)

const { Transform } = require('stream');

const toStringStream = new Transform({
  transform(chunk, encoding, callback) {
    const proto = {};
    const result = JSON.stringify(proto);
    console.log(result);
    return result;
  }
});

const protos = [];

parser.on('data', (chunk) => {
  const node = `
  node {
    name: "${chunk[0]}"
    op: "Const"
    attr {
      key: "dtype"
      value {
        type: DT_INT32
      }
    }
    attr {
      key: "value"
      value {
        tensor {
          dtype: DT_INT32
          tensor_shape {
          }
          int_val: ${chunk[5]}
        }
      }
    }
  }
  `;
  // console.log(node);
  protos.push(node);
});

readStream.pipe(parser);

console.log(protos);

// {
//   "attr": {
//     "dtype": {
//       "type": "DT_INT32"
//     }, 
//     "shape": {
//       "shape": {
//         "dim": [
//           {
//             "size": "2"
//           }, 
//           {
//             "size": "2"
//           }
//         ]
//       }
//     }
//   }, 
//   "name": "var1", 
//   "op": "Placeholder"
// }
