'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ChinaMap = function () {
  function ChinaMap() {
    var _this = this;

    _classCallCheck(this, ChinaMap);

    this.tipsDom = null;
    this.mapDom = null;
    this.tipQueue = null;
    this.tipsQueue = null;
    this.count = null;
    this.mark = null;
    this.mapChart = null;
    this.option = null;

    this.count = 4;
    this.mark = true;
    this.tipQueue = [];
    this.tipsQueue = [];
    this.tipsDom = $('#tips');
    this.mapDom = document.getElementById('map');
    this.mapChart = echarts.init(this.mapDom);
    this.option = {
      tooltip: {
        triggerOn: 'none'
      },
      geo: {
        map: 'china',
        emphasis: {
          label: {
            color: '#02d7da'
          }
        },
        itemStyle: {
          normal: {
            areaColor: '#202026',
            borderColor: '#69696d'
          },
          emphasis: {
            areaColor: '#2a333d'
          }
        },
        regions: [{
          name: '南海诸岛',
          value: 0,
          itemStyle: {
            normal: {
              opacity: 0,
              label: {
                show: false
              }
            }
          },
          emphasis: {
            label: {
              show: false
            }
          }
        }]
      },
      backgroundColor: '#111117', // 图表背景色
      series: [{
        id: 'background',
        coordinateSystem: 'geo',
        type: 'scatter',
        color: '#02d7da',
        symbolSize: '2.5',
        data: geography
      }, {
        id: 'customer',
        coordinateSystem: 'geo',
        type: 'scatter',
        color: 'rgba(0,0,0,0)',
        symbolSize: '2',
        data: customers,
        tooltip: {
          alwaysShowContent: true,
          position: 'top',
          formatter: function formatter(params) {
            var coordinate = _this.mapChart.convertToPixel('geo', params.value);
            var config = params.data;
            var htmlStr = '<div class="tip animated zoomIn" id="' + config.name + '" style="left: ' + coordinate[0] + 'px;top: ' + coordinate[1] + 'px;">\n                  <div class="message message-' + config.type + '">' + config.Name + ':' + config.state + config.Amount + '\u5143</div>\n                  <img class="head" src="./svg/' + config.type + '.svg" onload="javascript: ChinaMap.kill(\'' + config.name + '\');">\n                </div>';
            _this.tipsDom.append(htmlStr);
          },
          backgroundColor: 'rgba(0,0,0,0)'
        }
      }]
    };
    this.mapChart.setOption(this.option);
  }

  _createClass(ChinaMap, [{
    key: 'active',
    value: function active() {
      var _this2 = this;

      this.mark = false;
      //不间断的点击某个点
      var showTip = setInterval(function () {
        //tip队列为空时，停止循环
        if (_this2.tipQueue.length == 0) {
          _this2.mark = true;
          clearInterval(showTip);
          return;
        };
        //显示tip
        _this2.mapChart.dispatchAction({
          type: 'showTip',
          seriesIndex: 1,
          name: _this2.tipQueue[0].name
        });
        //去除已近触发的point
        _this2.tipQueue.shift();
        //容器中存在未触发的point
        if (_this2.tipsQueue.length > 0) {
          //添加到队列
          _this2.tipQueue.push(_this2.tipsQueue[0]);
          //修改渲染参数，并渲染
          customers[CUSTOMER_INDEX[_this2.tipsQueue[0].name]] = _this2.tipsQueue[0];
          _this2.option.series[1].data = customers;
          _this2.mapChart.setOption(_this2.option);
          //去除容器中已渲染的点
          _this2.tipsQueue.shift();
        }
      }, 1500);
    }
  }, {
    key: 'mount',
    value: function mount(message) {
      var _this3 = this,
          _tipsQueue;

      var users = JSON.parse(decodeURIComponent(message.data)).Users;

      // 处理后台数据
      users.forEach(function (item, index, _self) {
        //点的名称
        var name = item.ProviceNo + '-' + provices[item.ProviceNo];
        //单个点的配置参数
        var config = {
          name: name,
          Amount: '',
          Name: '',
          State: '',
          type: '',
          state: '',
          ProviceName: '',
          //点的坐标
          value: POINTS[name]

          //填充点的数据
        };for (var key in item) {
          if (config.hasOwnProperty(key)) config[key] = item[key];
        }
        config.type = config.State == 1 ? 'payment' : 'borrow';
        config.state = config.State == 1 ? '还款' : '借款';

        //保证在点阵范围内
        provices[item.ProviceNo] = provices[item.ProviceNo] < _this3.count ? ++provices[item.ProviceNo] : 0;

        _self[index] = config;
      });

      //将处理后的数据存入容器
      (_tipsQueue = this.tipsQueue).push.apply(_tipsQueue, _toConsumableArray(users));
      if (this.tipsQueue.length > 100) this.tipsQueue = this.tipsQueue.slice(-100);
      //tip队列有值 长度为count 队列满值不执行下文
      if (this.tipQueue.length == this.count) return;

      for (var i = this.tipQueue.length; i < this.count; i++) {
        if (this.tipsQueue.length > 0) {
          this.tipQueue[i] = this.tipsQueue[0];
          this.tipsQueue.shift();
        }
      }

      //队列及容器中的数据都用完了
      if (this.mark) {
        this.tipQueue.forEach(function (item) {
          customers[CUSTOMER_INDEX[item.name]] = item;
        });

        this.option.series[1].data = customers;
        this.mapChart.setOption(this.option);
        this.active();
      }
    }
  }], [{
    key: 'kill',
    value: function kill(id) {
      setTimeout(function () {
        $('#tips > #' + id).removeClass('zoomIn').addClass('zoomOut');
      }, 3000);
      setTimeout(function () {
        $('#tips > #' + id).remove();
      }, 4000);
    }
  }]);

  return ChinaMap;
}();
