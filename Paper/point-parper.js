const fs = require('fs'); //引入文件读取模块


const data = [{
  "name": "北京市",
  "log": "116.46",
  "lat": "39.92"
}, {
  "name": "上海市",
  "log": "121.48",
  "lat": "31.22"
}, {
  "name": "天津市",
  "log": "117.2",
  "lat": "39.13"
}, {
  "name": "重庆市",
  "log": "106.54",
  "lat": "29.59"
}, {
  "name": "河北省",
  "log": "114.48",
  "lat": "38.03"
}, {
  "name": "山西省",
  "log": "112.53",
  "lat": "37.87"
}, {
  "name": "辽宁省",
  "log": "123.38",
  "lat": "41.8"
}, {
  "name": "吉林省",
  "log": "125.35",
  "lat": "43.88"
}, {
  "name": "黑龙江省",
  "log": "126.63",
  "lat": "45.75"
}, {
  "name": "浙江省",
  "log": "120.19",
  "lat": "30.26"
}, {
  "name": "福建省",
  "log": "119.3",
  "lat": "26.08"
}, {
  "name": "山东省",
  "log": "106.54",
  "lat": "29.59"
}, {
  "name": "河南省",
  "log": "113.65",
  "lat": "34.76"
}, {
  "name": "湖北省",
  "log": "114.31",
  "lat": "30.52"
}, {
  "name": "湖南省",
  "log": "113",
  "lat": "28.21"
}, {
  "name": "广东省",
  "log": "113.23",
  "lat": "23.16"
}, {
  "name": "海南省",
  "log": "110.35",
  "lat": "20.02"
}, {
  "name": "四川省",
  "log": "104.06",
  "lat": "30.67"
}, {
  "name": "贵州省",
  "log": "106.71",
  "lat": "26.57"
}, {
  "name": "云南省",
  "log": "102.73",
  "lat": "25.04"
}, {
  "name": "江西省",
  "log": "115.89",
  "lat": "28.68"
}, {
  "name": "陕西省",
  "log": "108.95",
  "lat": "34.27"
}, {
  "name": "青海省",
  "log": "101.74",
  "lat": "36.56"
}, {
  "name": "甘肃省",
  "log": "103.73",
  "lat": "36.03"
}, {
  "name": "广西壮族自治区",
  "log": "106.54",
  "lat": "29.59"
}, {
  "name": "新疆维吾尔自治区",
  "log": "87.68",
  "lat": "43.77"
}, {
  "name": "内蒙古自治区",
  "log": "111.65",
  "lat": "40.82"
}, {
  "name": "西藏自治区",
  "log": "91.11",
  "lat": "29.97"
}, {
  "name": "宁夏回族自治区",
  "log": "106.27",
  "lat": "38.47"
}, {
  "name": "中国台湾",
  "log": "121.5",
  "lat": "25.14"
}, {
  "name": "中国香港",
  "log": "114.1",
  "lat": "22.2"
}, {
  "name": "中国澳门",
  "log": "113.33",
  "lat": "22.13"
}, {
  "name": "安徽省",
  "log": "117.27",
  "lat": "31.86"
}, {
  "name": "江苏省",
  "log": "118.78",
  "lat": "32.04"
}]

const pointData = {
  "110000": "北京",
  "120000": "天津",
  "130000": "河北",
  "140000": "山西",
  "150000": "内蒙古",
  "210000": "辽宁",
  "220000": "吉林",
  "230000": "黑龙江",
  "310000": "上海",
  "320000": "江苏",
  "330000": "浙江",
  "340000": "安徽",
  "350000": "福建",
  "360000": "江西",
  "370000": "山东",
  "410000": "河南",
  "420000": "湖北",
  "430000": "湖南",
  "440000": "广东",
  "450000": "广西",
  "460000": "海南",
  "500000": "重庆",
  "510000": "四川",
  "520000": "贵州",
  "530000": "云南",
  "540000": "西藏",
  "610000": "陕西",
  "620000": "甘肃",
  "630000": "青海",
  "640000": "宁夏",
  "650000": "新疆",
  "710000": "台湾",
  "810000": "香港",
  "820000": "澳门"
};

var point = {};

var points = {}

for (let id in pointData) {
  data.forEach(item => {
    // console.log(item.name.indexOf(pointData.id));
    if (item.name.indexOf(pointData[id]) > -1) {
      points[id.substr(0, 2)] = 0;
      point[id.substr(0, 2)] = {
        current: 0,
        provice: item.name,
        value: [{
            log: item.log * 1 + Math.random() * 2,
            lat: item.lat * 1 + Math.random() * 2,
          },
          {
            log: item.log * 1 - Math.random() * 2,
            lat: item.lat * 1 + Math.random() * 2,
          },
          {
            log: item.log * 1 + Math.random() * 2,
            lat: item.lat * 1 - Math.random() * 2,
          },
          {
            log: item.log * 1 - Math.random() * 2,
            lat: item.lat * 1 - Math.random() * 2,
          },
          {
            log: item.log * 1 - Math.random() * 2,
            lat: item.lat * 1 - Math.random() * 2,
          }
        ]
      }
    }
  });
}

fs.writeFile('./point.js', 'const POINTS = ' + JSON.stringify(point) + ';module.exports = POINTS;', 'utf8', (err, data) => {
  if (err) {
    throw err;
  }
});

fs.writeFile('./config/provices.js', 'var provices = ' + JSON.stringify(points), 'utf8', (err, data) => {
  if (err) {
    throw err;
  }
});