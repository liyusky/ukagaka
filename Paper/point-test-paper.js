const point = require('./point');
const fs = require('fs'); //引入文件读取模块


var pointData = [];
var indexData = {};
var count = 0;

for (let id in point) {

  let value = point[id].value;

  value.forEach((item, index) => {
    pointData.push({
      name: id + '-' + index,
      value: [item.log, item.lat],
    });
    indexData[id + '-' + index] = count;
    count++;
  });


}


fs.writeFile('./config/customer.js', 'var customers = ' + JSON.stringify(pointData), 'utf8', (err, data) => {
  if (err) {
    throw err;
  }
});
fs.writeFile('./customer.js', 'var customers = ' + JSON.stringify(pointData) + ';module.exports = customers;', 'utf8', (err, data) => {
  if (err) {
    throw err;
  }
});

fs.writeFile('./config/customer-index.js', 'const CUSTOMER_INDEX = ' + JSON.stringify(indexData), 'utf8', (err, data) => {
  if (err) {
    throw err;
  }
});