const fs = require('fs'); //引入文件读取模块

const customers = require('./config/customers');
console.log();


var points = {};
customers.forEach(item => {
  points[item.name] = item.value;
});


fs.writeFile('./config/points.js', 'const POINTS = ' + JSON.stringify(points), 'utf8', (err, data) => {
  if (err) {
    throw err;
  }
});