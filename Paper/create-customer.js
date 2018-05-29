const fs = require('fs'); //引入文件读取模块

const customers = require('./customer');


fs.writeFile('./config/customers.js', 'var customers = ' + JSON.stringify(customers), 'utf8', (err, data) => {
  if (err) {
    throw err;
  }
});