class ChinaMap {
  tipsDom = null;
  mapDom = null;
  tipQueue = null;
  tipsQueue = null;
  count = null;
  mark = null;
  mapChart = null;
  option = null;
  constructor() {
    //tipQueue默认存储量
    this.count = 4;
    //收到消息时执行active的开关,tipQueue无数据时触发
    this.mark = true;
    //页面出现的tip的队列
    this.tipQueue = [];
    //装载所有的tip的队列容器
    this.tipsQueue = [];
    //渲染tip的容器dom
    this.tipsDom = $('#tips');
    //渲染地图容器dom
    this.mapDom = document.getElementById('map');
    //初始化地图实例
    this.mapChart = echarts.init(this.mapDom);
    //地图配置
    this.option = {
      tooltip: {
        triggerOn: 'none'
      },
      geo: {
        map: 'china',
        emphasis: {
          label: {
            color: '#02d7da',
          }
        },
        layoutCenter: ['50%', '50%'],
        layoutSize: '130%',
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
          },
        }]
      },
      backgroundColor: '#111117', // 图表背景色
      series: [{
          id: 'background',
          coordinateSystem: 'geo',
          type: 'scatter',
          color: '#02d7da',
          symbolSize: '2.5',
          data: geography,
        },
        {
          id: 'customer',
          coordinateSystem: 'geo',
          type: 'scatter',
          color: 'rgba(0,0,0,0)',
          symbolSize: '2',
          data: customers,
          tooltip: {
            alwaysShowContent: true,
            position: 'top',
            formatter: params => {
              let coordinate = this.mapChart.convertToPixel('geo', params.value);
              let config = params.data;
              let htmlStr =
                `<div class="tip animated zoomIn" id="${config.name}" style="left: ${coordinate[0]}px;top: ${coordinate[1]}px;">
                  <div class="message message-${config.type}">${config.Name}:${config.state}${config.Amount}元</div>
                  <img class="head" src="./svg/${config.type}.svg" onload="javascript: ChinaMap.kill('${config.name}');">
                </div>`;
              this.tipsDom.append(htmlStr);
            },
            backgroundColor: 'rgba(0,0,0,0)'
          }
        }
      ]
    }
    //初始化地图
    this.mapChart.setOption(this.option);
  }

  //显示tip
  active() {
    this.mark = false;
    //不间断的点击某个点
    var showTip = setInterval(() => {
      //tip队列为空时，停止循环
      if (this.tipQueue.length == 0) {
        this.mark = true;
        clearInterval(showTip);
        return;
      };
      //显示tip
      this.mapChart.dispatchAction({
        type: 'showTip',
        seriesIndex: 1,
        name: this.tipQueue[0].name,
      });
      //去除已近触发的point
      this.tipQueue.shift();
      //容器中存在未触发的point
      if (this.tipsQueue.length > 0) {
        //添加到队列
        this.tipQueue.push(this.tipsQueue[0]);
        //修改渲染参数，并渲染
        customers[CUSTOMER_INDEX[this.tipsQueue[0].name]] = this.tipsQueue[0];
        this.option.series[1].data = customers;
        this.mapChart.setOption(this.option);
        //去除容器中已渲染的点
        this.tipsQueue.shift();
      }
    }, 1500);
  }

  //挂在websocket传递来的数据
  mount(message) {
    let users = JSON.parse(decodeURIComponent(message.data)).Users;

    // 处理后台数据
    users.forEach((item, index, _self) => {
      //点的名称
      let name = `${item.ProviceNo}-${provices[item.ProviceNo]}`;
      //单个点的配置参数
      let config = {
        name: name,
        Amount: '',
        Name: '',
        State: '',
        type: '',
        state: '',
        ProviceName: '',
        //点的坐标
        value: POINTS[name]
      }

      //填充点的数据
      for (let key in item) {
        if (config.hasOwnProperty(key)) config[key] = item[key];
      }
      config.type = config.State == 1 ? 'payment' : 'borrow';
      config.state = config.State == 1 ? '还款' : '借款';

      //保证在点阵范围内
      provices[item.ProviceNo] = provices[item.ProviceNo] < this.count ? ++provices[item.ProviceNo] : 0;

      _self[index] = config;
    });

    //将处理后的数据存入容器
    this.tipsQueue.push(...users);
    if (this.tipsQueue.length > 100) this.tipsQueue = this.tipsQueue.slice(-100);
    //tip队列有值 长度为count 队列满值不执行下文
    if (this.tipQueue.length == this.count) return;

    for (let i = this.tipQueue.length; i < this.count; i++) {
      if (this.tipsQueue.length > 0) {
        this.tipQueue[i] = this.tipsQueue[0];
        this.tipsQueue.shift();
      }
    }

    //队列及容器中的数据都用完了
    if (this.mark) {
      this.tipQueue.forEach(item => {
        customers[CUSTOMER_INDEX[item.name]] = item;
      });

      this.option.series[1].data = customers;
      this.mapChart.setOption(this.option);
      this.active();
    }

  }

  //关闭对应的tip
  static kill(id) {
    setTimeout(() => {
      $('#tips > #' + id).removeClass('zoomIn').addClass('zoomOut');
    }, 3000);
    setTimeout(() => {
      $('#tips > #' + id).remove();
    }, 4000)
  }
}