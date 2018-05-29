class Balance {
  option = null;
  previousBalance = null;

  constructor() {
    this.option = {
      TradingVolume: 'today-trade',
      TotalAmount: 'accumulate-trade',
      AvgAmount: 'average-trade',
      RegUserMin1: 'nearlyone',
      NumberTrades: 'today-count',
      TotalTrades: 'accumutrans',
      TodayRegUser: 'today-register',
      TotalRegCount: 'accumulatedUser',
      TradesMin1: 'transaction-one'
    };

    this.previousBalance = {
      TradingVolume: 0,
      TotalAmount: 0,
      AvgAmount: 0,
      RegUserMin1: 0,
      NumberTrades: 0,
      TotalTrades: 0,
      TodayRegUser: 0,
      TotalRegCount: 0,
      TradesMin1: 0
    }

    this.init();
  }

  init() {
    var htmlStr = `<div class="l js-l-box digit-container boxs" data-show="0">
        <span>0</span>
        <span>1</span>
        <span>2</span>
        <span>3</span>
        <span>4</span>
        <span>5</span>
        <span>6</span>
        <span>7</span>
        <span>8</span>
        <span>9</span>
      </div>`;
    for (let key in this.option) {
      $('#' + this.option[key]).append(htmlStr);
    }
  }

  setHtml(len) {
    var htmlStr = '';
    var numStr = `<div class="l js-l-box digit-container boxs" data-show="0">
        <span>0</span>
        <span>1</span>
        <span>2</span>
        <span>3</span>
        <span>4</span>
        <span>5</span>
        <span>6</span>
        <span>7</span>
        <span>8</span>
        <span>9</span>
      </div>`;
    var signStr = '<div class="sign-box l"><span>,</span></div>';
    for (var i = 0; i < len; i++) {
      if (i > 0 && i % 3 == 0) {
        htmlStr = signStr + htmlStr;
      }
      htmlStr = numStr + htmlStr;
    }
    return htmlStr;
  }

  active(key, newPrice) {
    let id = this.option[key];
    var oldPrice = this.previousBalance[key];
    var newArr = String(newPrice).split('');
    var oldArr = String(oldPrice).split('');
    var newLen = newArr.length;
    var newCount = newArr.length + Math.ceil(newArr.length / 3) - 1;
    var oldCount = oldArr.length + Math.ceil(oldArr.length / 3) - 1;
    let wrapDom = $('#' + id);
    wrapDom.html(this.setHtml(newLen));
    let itemDoms = wrapDom.find('.digit-container');
    itemDoms.each((index, item) => {
      $(item).css('margin-top', oldArr[index] * -44 + 'px');
    });

    itemDoms.each((index, item) => {
      $(item).animate({
        marginTop: newArr[index] * -44 + 'px'
      }, 1500, () => {
        this.previousBalance[key] = newPrice;
        for (let i = 0; i < oldCount - newCount; i++) {
          itemDoms.get(i).remove();
        }
      });
    });
  }

  mount(message) {
    let data = JSON.parse(decodeURIComponent(message.data));
    for (let key in data) {
      if (this.previousBalance.hasOwnProperty(key)) {
        if (key == 'AvgAmount') data[key] = Math.ceil(data[key]);
        this.active(key, data[key]);
      }
    }
  }

}